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

    public setInputByIndex(index: number, input: ScuffrSvgInput) {
        this.parent.block.setInputByIndex(index, input.asInput());
        const oldInput = this.inputs[index];
        if (!oldInput)
            throw new Error(`No input ${this.block.type.inputs[index].name} on block ${this.parent.block.type.id}.`);
        this.dom.replaceChild(input.dom, oldInput.rendered.dom);
        if (oldInput.rendered.onAncestryChange)
            oldInput.rendered.onAncestryChange(null);
        input.setParent({ index: oldInput.input.index, parent: this });
        this.children[oldInput.partIndex] = input;
        this.inputs[oldInput.input.index] = { input: oldInput.input, rendered: input, partIndex: oldInput.partIndex };
        oldInput.input.createAttachmentPoints(this, input);
        this.update(true);
    }
}
