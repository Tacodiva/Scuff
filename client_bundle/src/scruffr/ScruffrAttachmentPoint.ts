import type { ScruffrElement } from "./ScruffrElement";
import type { ScruffrBlockInstanceElement } from "./ScruffrBlockInstanceElement";
import type { ScruffrRootScriptElement, ScruffrScriptElement } from "./ScruffrScriptElement";
import type { Vec2 } from "../utils/Vec2";
import type { BlockScript } from "../block/BlockScript";
import type { BlockInstance } from "../block/BlockInstance";
import { BlockInputTypeSubscript, type BlockInputType, type IBlockInput } from "../block/BlockInputType";

export class ScruffrAttachmentPointList<TPoint extends ScruffrAttachmentPoint = ScruffrAttachmentPoint> {
    public readonly list: TPoint[];
    public root: ScruffrRootScriptElement;

    public constructor(root: ScruffrRootScriptElement) {
        this.list = [];
        this.root = root;
        this.root.workspace.attachmentPoints.add(this);
    }

    public clear() {
        this.list.length = 0;
    }

    public push(point: TPoint) {
        this.list.push(point);
    }

    public delete() {
        this.root.workspace.attachmentPoints.delete(this);
    }

    public recalculateTranslation() {
        for (const point of this.list)
            point.recalculateTranslation();
    }

    public onAncestryChange(root: ScruffrRootScriptElement | null) {
        if (root === null) {
            this.delete();
        } else {
            this.root = root;
            this.recalculateTranslation();
        }
    }
}

export abstract class ScruffrAttachmentPoint {
    public abstract readonly parent: ScruffrElement;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScruffrRootScriptElement): Vec2 {
        const translation = this.translation;
        return {
            x: this.translation.x + this.root.translationX - source.translationX,
            y: this.translation.y + this.root.translationY - source.translationY
        };
    }

    public get translation(): Vec2 {
        if (this._translation !== null) return this._translation;
        return this.recalculateTranslation();
    }

    public recalculateTranslation() {
        const absTrans = this.parent.getAbsoluteTranslation();
        return this._translation = {
            x: absTrans.x - this.root.translationX + this.offset.x + this.parent.leftOffset,
            y: absTrans.y - this.root.translationY + this.offset.y
        };
    }

    public abstract get root(): ScruffrRootScriptElement;

    public abstract canTakeScript(script: ScruffrRootScriptElement): boolean;
    public abstract takeScript(script: ScruffrRootScriptElement): void;
}

export interface IScruffrPointAttachable extends ScruffrElement {
    attachmentPoints : ScruffrAttachmentPointList;
}

export class ScruffrBlockInputAttachmentPoint extends ScruffrAttachmentPoint {
    public readonly block: ScruffrBlockInstanceElement;
    public readonly input: BlockInputType<IBlockInput | BlockInstance>;
    public readonly parent: IScruffrPointAttachable;

    public constructor(block: ScruffrBlockInstanceElement, input: BlockInputType<IBlockInput | BlockInstance>, part: IScruffrPointAttachable) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScruffrRootScriptElement): boolean {
        if (script.children.length !== 1) return false;
        return this.input.isValidValue(script.children[0].block) !== null;
    }

    public takeScript(script: ScruffrRootScriptElement): void {
        this.block.setInput(this.input, script.children[0]);
        script.workspace.deleteRenderedScript(script, false);
    }

    public get root() {
        return this.block.root;
    }
}

export class ScruffrScriptAttachmentPoint extends ScruffrAttachmentPoint {
    public readonly parent: ScruffrScriptElement<BlockScript>;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScruffrScriptElement<BlockScript>, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public canTakeScript(script: ScruffrRootScriptElement): boolean {
        if (this.requireStackUp) {
            const firstBlock = script.script.blocks[0];
            if (!firstBlock.type.canStackUp(firstBlock))
                return false;
        }
        if (this.requireStackDown) {
            const lastBlock = script.script.blocks[script.script.blocks.length - 1];
            if (!lastBlock.type.canStackDown(lastBlock))
                return false;
        }
        return true;
    }

    public takeScript(script: ScruffrRootScriptElement): void {
        const firstBlock = script.children[0];
        for (const input of firstBlock.block.type.inputs) {
            if (input instanceof BlockInputTypeSubscript) {
                const firstScript = firstBlock.block.getInput(input);
                if (firstScript.blocks.length === 0) {
                    // TODO Check distance to see if we should wrap or just place
                    this.parent.wrapScript(this.index, script, firstBlock, input);
                    return;
                }
                break;
            }
        }
        this.parent.insertScript(this.index, script);
    }

    public override calculateDelta(source: ScruffrRootScriptElement): Vec2 {
        const delta = super.calculateDelta(source);
        if (delta.y < 0) {
            let newY = delta.y - source.topOffset;
            if (newY < -delta.y) delta.y = newY;
        } else {
            let newY = delta.y - source.bottomOffset;
            if (-newY < delta.y) delta.y = newY;
        }
        return delta;
    }

    public get root(): ScruffrRootScriptElement {
        return this.parent.getRoot();
    }
}