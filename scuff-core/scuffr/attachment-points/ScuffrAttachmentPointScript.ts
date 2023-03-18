import type { Vec2 } from "../../utils/Vec2";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrSvgScript } from "../ScuffrSvgScript";
import type { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
import type { ScuffrSvgBlockInstance } from "../ScuffrSvgBlockInstance";
import type { ScuffrWrapInfo } from "../ScuffrWrappingDescriptor";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdAttchScriptTakeScript } from "../commands/ScuffrCmdAttchScriptTakeScript";

export class ScuffrAttachmentPointScript extends ScuffrAttachmentPoint {
    public readonly parent: ScuffrSvgScript;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScuffrSvgScript, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public canTakeScript(script: ScuffrSvgScriptRoot): boolean {
        if (script.getWrapperInput())
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

    public takeScriptCommand(script: ScuffrSvgScriptRoot): ScuffrCmd {
        return new ScuffrCmdAttchScriptTakeScript(script, this.parent.getReference(), this.index, true);
    }

    public override calculateDelta(source: ScuffrSvgScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.topOffset;
        return delta;
    }

    public get root(): ScuffrSvgScriptRoot {
        return this.parent.getRoot();
    }

    public highlight(script: ScuffrSvgScriptRoot): void {
        this.parent.addGhost(this.index, script.children[0] as ScuffrSvgBlockInstance, true);
    }

    public unhighlight(script: ScuffrSvgScriptRoot): void {
        this.parent.removeGhost();
    }
}