
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrElementScript } from "../ScuffrElementScript";
import { ScuffrAttachmentPointScript } from "./ScuffrAttachmentPointScript";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdAttchScriptTakeScript } from "../commands/ScuffrCmdAttchScriptTakeScript";

export class ScuffrAttachmentPointScriptTop extends ScuffrAttachmentPointScript {

    public constructor(script: ScuffrElementScript, offset: Vec2) {
        super(script, 0, false, true, offset);
    }

    public override calculateDelta(source: ScuffrElementScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.bottomOffset;
        return delta;
    }

    public override takeScriptCommand(script: ScuffrElementScriptRoot): ScuffrCmd {
        return new ScuffrCmdAttchScriptTakeScript(script, this.parent.getReference(), this.index, false);
    }

    public override highlight(script: ScuffrElementScriptRoot): void {
        this.parent.addGhost(this.index, script.children[script.children.length - 1] as ScuffrElementBlockInstance, false);
    }
}