import { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrReferenceBlock, ScuffrReferenceParentBlock } from "../ScuffrReferenceTypes";
import type { ScuffrReferenceLink } from "../ScuffrReference";
import { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";
import { ScuffrCmdScriptSelectBlockInput } from "../commands/ScuffrCmdScriptSelectBlockInput";
import type { ScuffrSvgBlockInstance } from "./ScuffrSvgBlockInstance";
import { Vec2 } from "@scuff/core";

export class ScuffrSvgBlockContent extends ScuffrSvgElementParent implements ScuffrReferenceParentBlock<ScuffrSvgBlockPart>, ScuffrReferenceLink<ScuffrSvgBlockPart> {
    public children: ScuffrSvgBlockPart[];
    public parent: ScuffrSvgBlockInstance;

    public get root() { return this.parent.root; }
    public get block() { return this.parent.block; }
    public get scriptContainer() { return this.parent.parent.scriptContainer }

    public constructor(parent: ScuffrSvgBlockInstance) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [];
    }

    public renderAll() {
        this.children = this.parent.renderer.createParts(this.block);
    }

    public onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean {
        const block = this.children[reference.index];
        const translation = Vec2.copy(block.getAbsoluteTranslation());
        translation.x += block.leftOffset;
        new ScuffrInteractionDragScript(
            new ScuffrCmdScriptSelectBlockInput(reference, translation),
            event
        ).start();
        return true;
    }

    public getRoot(): ScuffrSvgScriptRoot {
        return this.parent.root;
    }

    public getReferenceValue(index: number): ScuffrSvgBlockPart {
        return this.children[index];
    }

    public getReference(): ScuffrReferenceBlock {
        return this.parent.getReference();
    }

    /**
     * Replaces one of our child block parts with another.
     * @param index The index of the child to replace.
     * @param replacement The part to replace it with.
     * @returns Our old child which has been replaced.
     */
    public replaceChild(index: number, replacement: ScuffrSvgBlockPart): ScuffrSvgBlockPart {
        const oldInput = this.children[index];
        this.dom.replaceChild(replacement.dom, oldInput.dom);
        if (oldInput.onAncestryChange)
            oldInput.onAncestryChange(null);
        if (replacement.setParent)
            replacement.setParent({ index, parent: this });
        this.children[index] = replacement;
        // oldInput.input.createAttachmentPoints(this, input);
        this.update(true);
        return oldInput;
    }
}
