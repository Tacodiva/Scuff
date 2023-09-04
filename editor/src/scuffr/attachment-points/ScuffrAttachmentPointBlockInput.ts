import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import type { ScuffrSvgBlockPart } from "../svg/ScuffrSvgBlockPart";
import type { ScuffrReferenceable } from "../ScuffrReference";
import { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";
import type { ScuffEditorInteractionDrag } from "../../editor/ScuffEditorInteractionDrag";

export abstract class ScuffrAttachmentPointBlockInput extends ScuffrAttachmentPoint<ScuffrInteractionDragScript> {
    public readonly block: ScuffrSvgBlockInstance;
    public readonly parent: ScuffrSvgBlockPart & ScuffrReferenceable;

    public constructor(part: ScuffrSvgBlockPart & ScuffrReferenceable) {
        super();
        this.parent = part;
        if (!(part.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrAttachmentPointBlockInput part's parent must be a block instance.");
        this.block = part.parent;
    }

    protected abstract canAttachBlock(block: ScuffrSvgBlockInstance): boolean;
    protected abstract attachBlock(block: ScuffrSvgBlockInstance): ScuffrCmd;

    public canAttach(drag: ScuffEditorInteractionDrag): drag is ScuffrInteractionDragScript {
        if (!(drag instanceof ScuffrInteractionDragScript))
            return false;
        if (drag.script.children.length !== 1)
            return false;
        return this.canAttachBlock(drag.script.children[0] as ScuffrSvgBlockInstance);
    }

    public attach(drag: ScuffrInteractionDragScript): ScuffrCmd {
        return this.attachBlock(drag.script.children[0] as ScuffrSvgBlockInstance);
    }

    public get root() {
        return this.block.root;
    }

    public highlight(): void {
        this.parent.dom.classList.add("scuff-input-highlight");
    }

    public unhighlight(): void {
        this.parent.dom.classList.remove("scuff-input-highlight");
    }
}