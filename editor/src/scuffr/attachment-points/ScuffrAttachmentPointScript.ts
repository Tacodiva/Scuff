import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrSvgScript } from "../svg/ScuffrSvgScript";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import type { ScuffrWrapInfo } from "../ScuffrWrappingDescriptor";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdAttchScriptTakeScript } from "../commands/ScuffrCmdAttchScriptTakeScript";
import { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";
import type { Vec2 } from "@scuff/core";
import type { ScuffEditorInteractionDrag } from "../../editor/ScuffEditorInteractionDrag";

export class ScuffrAttachmentPointScript extends ScuffrAttachmentPoint<ScuffrInteractionDragScript> {
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

    public canAttach(drag: ScuffEditorInteractionDrag): drag is ScuffrInteractionDragScript {
        if (!(drag instanceof ScuffrInteractionDragScript))
            return false;
        if (drag.script.getWrapperInput())
            return true;
        if (this.requireStackUp) {
            const firstBlock = drag.script.script.blocks[0];
            if (!firstBlock.type.canStackUp(firstBlock))
                return false;
        }
        if (this.requireStackDown) {
            const lastBlock = drag.script.script.blocks[drag.script.script.blocks.length - 1];
            if (!lastBlock.type.canStackDown(lastBlock))
                return false;
        }
        return true;
    }

    public attach(drag: ScuffrInteractionDragScript): ScuffrCmd {
        return new ScuffrCmdAttchScriptTakeScript(drag.script, this.parent.getReference(), this.index, true);
    }

    public override calculateDelta(source: ScuffrSvgScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.topOffset;
        return delta;
    }

    public get root(): ScuffrSvgScriptRoot {
        return this.parent.getRoot();
    }

    public highlight(drag: ScuffrInteractionDragScript): void {
        this.parent.addGhost(this.index, drag.script.children[0] as ScuffrSvgBlockInstance, true);
    }

    public unhighlight(): void {
        this.parent.removeGhost();
    }
}