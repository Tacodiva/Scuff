import type { ScuffrElement } from "./ScuffrElement";
import type { IScuffrBlockPartElement, ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInputType } from "../block/BlockInputType";

abstract class ScuffrAttachmentPoint {
    public abstract readonly parent: ScuffrElement;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScuffrRootScriptElement, target: ScuffrRootScriptElement): Vec2 {
        const translation = this.translation;
        return {
            x: this.translation.x + target.translation.x - source.translation.x,
            y: this.translation.y + target.translation.y - source.translation.y
        };
    }

    public get translation(): Vec2 {
        if (this._translation !== null) return this._translation;
        return this.recalculateTranslation();
    }

    public recalculateTranslation() {
        const absTrans = this.parent.getAbsoluteTranslation();
        return this._translation = {
            x: absTrans.x - this.root.translation.x + this.offset.x + this.parent.leftOffset,
            y: absTrans.y - this.root.translation.y + this.offset.y
        };
    }

    public abstract get root() : ScuffrRootScriptElement;

    public abstract addHighlight(): void;
    public abstract removeHighlight(): void;
    public abstract canTakeScript(script: ScuffrRootScriptElement): boolean;
    public abstract takeScript(script: ScuffrRootScriptElement): void;
}

class ScuffrBlockInputAttachmentPoint extends ScuffrAttachmentPoint {
    public readonly block: ScuffrBlockInstanceElement;
    public readonly input: BlockInputType;
    public readonly parent: IScuffrBlockPartElement;

    public constructor(block: ScuffrBlockInstanceElement, input: BlockInputType, part: IScuffrBlockPartElement) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
    }

    public addHighlight(): void {
    }

    public removeHighlight(): void {
    }

    public canTakeScript(script: ScuffrRootScriptElement): boolean {
        if (script.children.length !== 1) return false;
        return this.input.canTakeValue(script.children[0].block);
    }

    public takeScript(script: ScuffrRootScriptElement): void {
        this.block.setInput(this.input, script.children[0]);
    }

    public get root() {
        return this.block.root;
    }
}

class ScuffrScriptAttachmentPoint extends ScuffrAttachmentPoint {
    public readonly parent: ScuffrRootScriptElement;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScuffrRootScriptElement, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public addHighlight(): void {
    }

    public removeHighlight(): void {
    }

    public canTakeScript(script: ScuffrRootScriptElement): boolean {
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

    public takeScript(script: ScuffrRootScriptElement): void {
        this.parent.insertScript(this.index, script);
    }

    public override calculateDelta(source: ScuffrRootScriptElement, target: ScuffrRootScriptElement): Vec2 {
        const delta = super.calculateDelta(source, target);
        if (delta.y < 0) {
            let newY = delta.y - source.topOffset;
            if (newY < -delta.y) delta.y = newY;
        } else {
            let newY = delta.y - source.bottomOffset;
            if (-newY < delta.y) delta.y = newY;
        }
        return delta;
    }

    public get root(): ScuffrRootScriptElement {
        return this.parent.getRoot();
    }
}

export { ScuffrBlockInputAttachmentPoint, ScuffrAttachmentPoint, ScuffrScriptAttachmentPoint };