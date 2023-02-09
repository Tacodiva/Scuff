import type { Vec2 } from "../../utils/Vec2";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrElementScript } from "../ScuffrElementScript";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import type { ScuffrWrappingDescriptor } from "../ScuffrWrappingDescriptor";

export class ScuffrAttachmentPointScript extends ScuffrAttachmentPoint {
    public readonly parent: ScuffrElementScript;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScuffrElementScript, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public canTakeScript(script: ScuffrElementScriptRoot): boolean {
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

    public takeScript(script: ScuffrElementScriptRoot): void {
        this.parent.insertScript(this.index, script, this._getWrapping(script));
    }

    public override calculateDelta(source: ScuffrElementScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.topOffset;
        return delta;
    }

    public get root(): ScuffrElementScriptRoot {
        return this.parent.getRoot();
    }

    public highlight(script: ScuffrElementScriptRoot): void {
        this.parent.addGhost(this.index, script.children[0] as ScuffrElementBlockInstance, this._getWrapping(script));
    }

    public unhighlight(script: ScuffrElementScriptRoot): void {
        this.parent.removeGhost();
    }

    protected _getWrapping(script: ScuffrElementScriptRoot): ScuffrWrappingDescriptor | null {
        return this.parent.tryWrap(this.index, script.children[0]);
    }
}