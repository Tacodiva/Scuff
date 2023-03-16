import type { Vec2 } from "../../utils/Vec2";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrElementScript } from "../ScuffrElementScript";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import type { ScuffrWrapInfo } from "../ScuffrWrappingDescriptor";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdAttchScriptTakeScript } from "../commands/ScuffrCmdAttchScriptTakeScript";

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

    public takeScriptCommand(script: ScuffrElementScriptRoot): ScuffrCmd {
        return new ScuffrCmdAttchScriptTakeScript(script, this.parent.getReference(), this.index, true);
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
        this.parent.addGhost(this.index, script.children[0] as ScuffrElementBlockInstance, true);
    }

    public unhighlight(script: ScuffrElementScriptRoot): void {
        this.parent.removeGhost();
    }
}