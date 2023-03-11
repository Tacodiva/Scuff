import { BlockPartInput } from "../block/BlockPartInput";
import { ScuffrElementParent } from "./ScuffrElementParent";
import { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrReferenceParentBlock } from "./ScuffrReferenceTypes";
import type { ScuffrReference, ScuffrReferenceLink } from "./ScuffrReference";

interface ScuffrBlockContentInput {
    input: BlockPartInput;
    rendered: ScuffrElementInput;
    partIndex: number;
}

export class ScuffrElementBlockContent extends ScuffrElementParent implements ScuffrReferenceParentBlock<ScuffrElementInput>, ScuffrReferenceLink<ScuffrElementInput> {
    public children: ScuffrElementBlockPart[];
    public parent: ScuffrElementBlockInstance;
    public inputs: ScuffrBlockContentInput[];

    public get root() { return this.parent.root; }
    public get block() { return this.parent.block; }

    public constructor(parent: ScuffrElementBlockInstance) {
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

    public setInput(key: BlockPartInput, input: ScuffrElementInput) {
        this.parent.block.setInput(key, input.asInput());
        const oldInput = this.getInput(key);
        if (!oldInput)
            throw new Error(`No input ${key.name} on block ${this.parent.block.type.id}.`);
        this.dom.replaceChild(input.dom, oldInput.rendered.dom);
        if (oldInput.rendered.onAncestryChange)
            oldInput.rendered.onAncestryChange(null);
        input.setParent({ index: oldInput.input.index, parent: this });
        this.children[oldInput.partIndex] = input;
        this.inputs[oldInput.input.index] = { input: key, rendered: input, partIndex: oldInput.partIndex };
        key.createAttachmentPoints(this, input);
        this.update(true);
    }

    public getInput(key: BlockPartInput): ScuffrBlockContentInput | null {
        return this.inputs[key.index];
    }

    public onChildDrag(index: number, event: MouseEvent): boolean {
        const input = this.inputs[index];
        if (!(input && input.rendered instanceof ScuffrElementBlockInstance)) {
            console.warn("Block instance recieved invalid key in onChildDrag.");
            return true;
        }
        input.rendered.attachmentPoints.clear();
        this.workspace.dragRenderedBlock(input.rendered, event);
        this.parent.block.resetInput(input.input);
        this._renderPart(input.partIndex).updateAll();
        this.update(true);
        return true;
    }

    public getRoot(): ScuffrElementScriptRoot {
        return this.parent.root;
    }

    public getIndexValue(index: number): ScuffrElementInput {
        const input = this.inputs[index];
        if (input && input.rendered instanceof ScuffrElementBlockInstance)
            return input.rendered;
        throw new Error(`Invalid input index ${index}.`);
    }

    public getReference(): ScuffrReference<this> {
        throw new Error("Method not implemented.");
    }
}
