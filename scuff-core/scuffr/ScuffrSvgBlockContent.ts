import { BlockPartInput } from "../block/BlockPartInput";
import { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import { ScuffrSvgBlockInstance } from "./ScuffrSvgBlockInstance";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrReferenceBlock, ScuffrReferenceParentBlock } from "./ScuffrReferenceTypes";
import type { ScuffrReferenceLink } from "./ScuffrReference";
import { ScuffrInteractionDragScript } from "./interactions/ScuffrInteractionDragScript";
import { ScuffrCmdScriptSelectBlockInput } from "./commands/ScuffrCmdScriptSelectBlockInput";

interface ScuffrBlockContentInput {
    input: BlockPartInput;
    rendered: ScuffrSvgInput;
    partIndex: number;
}

export class ScuffrSvgBlockContent extends ScuffrSvgElementParent implements ScuffrReferenceParentBlock<ScuffrSvgInput>, ScuffrReferenceLink<ScuffrSvgInput> {
    public children: ScuffrSvgBlockPart[];
    public parent: ScuffrSvgBlockInstance;
    public inputs: ScuffrBlockContentInput[];

    public get root() { return this.parent.root; }
    public get block() { return this.parent.block; }

    public constructor(parent: ScuffrSvgBlockInstance) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [];
        this.inputs = [];
    }

    public renderAll() {
        for (let partIdx = 0; partIdx < this.parent.block.type.parts.length; partIdx++)
            this._renderPart(partIdx);
    }

    private _renderPart(partIndex: number) {
        const part = this.parent.block.type.parts[partIndex];
        let rendered;
        if (part instanceof BlockPartInput) {
            rendered = part.render(this);
            this.inputs[part.index] = { rendered, input: part, partIndex };
            part.createAttachmentPoints(this, rendered);
        } else {
            rendered = part.render(this);
        }
        this.children[partIndex] = (rendered);
        return rendered;
    }

    public setInput(key: BlockPartInput, input: ScuffrSvgInput) {
        this.setInputByIndex(key.index, input);
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

    public getInput(key: BlockPartInput): ScuffrBlockContentInput | null {
        return this.inputs[key.index];
    }

    public onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean {
        const block = this.inputs[reference.index].rendered;
        const translation = block.getAbsoluteTranslation();
        translation.x += block.leftOffset;
        this.workspace.startInteraction(
            new ScuffrInteractionDragScript(
                new ScuffrCmdScriptSelectBlockInput(reference, translation),
                event
            ),
        );
        return true;
    }

    public detachBlock(index: number): ScuffrSvgBlockInstance {
        const input = this.inputs[index];
        if (!(input && input.rendered instanceof ScuffrSvgBlockInstance))
            throw new Error(`Block input ${index} is not a block.`);
        input.rendered.attachmentPoints.clear();
        this.parent.block.resetInput(input.input);
        this._renderPart(input.partIndex).updateAll();
        this.update(true);
        return input.rendered;
    }

    public getRoot(): ScuffrSvgScriptRoot {
        return this.parent.root;
    }

    public getReferenceValue(index: number): ScuffrSvgInput {
        return this.inputs[index].rendered;
    }

    public getReference(): ScuffrReferenceBlock {
        return this.parent.getReference();
    }
}
