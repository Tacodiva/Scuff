import type { Vec2 } from "../../utils/Vec2";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrScriptElement } from "../ScuffrScriptElement";
import type { ScuffrRootScriptElement } from "../ScuffrRootScriptElement";
import type { ScuffrBlockInstanceElement } from "../ScuffrBlockInstanceElement";
import type { ScuffrWrappingDescriptor } from "../ScuffrWrappingDescriptor";

export class ScuffrScriptAttachmentPoint extends ScuffrAttachmentPoint {
    public readonly parent: ScuffrScriptElement;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScuffrScriptElement, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public canTakeScript(script: ScuffrRootScriptElement): boolean {
        if (this._getWrapping(script))
            return true;
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
        this.parent.insertScript(this.index, script, this._getWrapping(script));
    }

    public override calculateDelta(source: ScuffrRootScriptElement): Vec2 {
        const delta = this._calculateRawDelta(source);
        let a = delta.y - source.topOffset;
        let b = delta.y + source.topOffset;
        if (Math.abs(a) < Math.abs(b)) delta.y = a;
        else delta.y = b;
        return delta;
    }

    public get root(): ScuffrRootScriptElement {
        return this.parent.getRoot();
    }

    public highlight(script: ScuffrRootScriptElement): void {
        this.parent.addGhost(this.index, script.children[0] as ScuffrBlockInstanceElement, this._getWrapping(script));
    }

    public unhighlight(script: ScuffrRootScriptElement): void {
        this.parent.removeGhost();
    }

    protected _getWrapping(script: ScuffrRootScriptElement): ScuffrWrappingDescriptor | null {
        return this.parent.tryWrap(this.index, script.children[0]);
    }
}