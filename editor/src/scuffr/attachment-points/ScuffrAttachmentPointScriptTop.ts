
import type { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrSvgScript } from "../svg/ScuffrSvgScript";
import { ScuffrAttachmentPointScript } from "./ScuffrAttachmentPointScript";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdAttchScriptTakeScript } from "../commands/ScuffrCmdAttchScriptTakeScript";
import type { Vec2 } from "@scuff/core";
import type { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";

export class ScuffrAttachmentPointScriptTop extends ScuffrAttachmentPointScript {
    public constructor(script: ScuffrSvgScript, offset: Vec2) {
        super(script, 0, false, true, offset);
    }

    public override calculateDelta(source: ScuffrSvgScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.bottomOffset;
        return delta;
    }

    public override attach(drag: ScuffrInteractionDragScript): ScuffrCmd {
        return new ScuffrCmdAttchScriptTakeScript(drag.script, this.parent.getReference(), this.index, false);
    }

    public override highlight(drag: ScuffrInteractionDragScript): void {
        this.parent.addGhost(this.index, drag.script.children[drag.script.children.length - 1] as ScuffrSvgBlockInstance, false);
    }
}