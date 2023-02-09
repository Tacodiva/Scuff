import { ScuffrBlockReference, type ScuffrBlockReferenceParent } from "./ScuffrBlockReference";
import { BlockPartInput } from "../block/BlockPartInput";
import { ScuffrElementParent } from "./ScuffrElementParent";
import { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";

interface ScuffrBlockContentInput {
    part: BlockPartInput,
    element: ScuffrElementInput,
    index: number,
}

export class ScuffrElementBlockContent extends ScuffrElementParent implements ScuffrBlockReferenceParent<BlockPartInput> {
    public children: ScuffrElementBlockPart[];
    public parent: ScuffrElementBlockInstance;
    public inputs: Map<string, ScuffrBlockContentInput>;

    public get root() { return this.parent.root; }

    public constructor(parent: ScuffrElementBlockInstance) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [];
        this.inputs = new Map();
    }

    public renderAll() {
        for (let partIdx = 0; partIdx < this.parent.block.type.parts.length; partIdx++)
            this._renderPart(partIdx);
    }

    private _renderPart(index: number) {
        const part = this.parent.block.type.parts[index];
        let renderedPart;
        if (part instanceof BlockPartInput) {
            renderedPart = part.render(this);
            this.inputs.set(part.id, { element: renderedPart, part, index });
            part.createAttachmentPoints(this, renderedPart);
        } else {
            renderedPart = part.render(this);
        }
        this.children[index] = (renderedPart);
        return renderedPart;
    }

    public setInput(key: BlockPartInput, input: ScuffrElementInput) {
        this.parent.block.setInput(key, input.asInput());
        const oldInput = this.getInput(key);
        if (!oldInput)
            throw new Error(`No input ${key.id} on block ${this.parent.block.type.id}.`);
        this.dom.replaceChild(input.dom, oldInput.element.dom);
        if (oldInput.element.onAncestryChange)
            oldInput.element.onAncestryChange(null);
        input.setParent(new ScuffrBlockReference(key, this));
        this.children[oldInput.index] = input;
        this.inputs.set(key.id, { part: key, element: input, index: oldInput.index });
        key.createAttachmentPoints(this, input);
        this.update(true);
    }

    public getInput(key: BlockPartInput): ScuffrBlockContentInput | null {
        return this.inputs.get(key.id) ?? null;
    }

    public getBlockElement(key: BlockPartInput): ScuffrElementBlockInstance | null {
        const input = this.getInput(key);
        if (input && input.element instanceof ScuffrElementBlockInstance)
            return input.element;
        return null;
    }

    public onChildDrag(key: BlockPartInput, event: MouseEvent): boolean {
        const input = this.getInput(key);
        if (!(input && input.element instanceof ScuffrElementBlockInstance)) {
            console.warn("Block instance recieved invalid key in onChildDrag.");
            return true;
        }
        input.element.attachmentPoints.clear();
        this.workspace.dragRenderedBlock(input.element, event);
        this.parent.block.resetInput(key.id);
        this._renderPart(input.index).updateAll();
        this.update(true);
        return true;
    }

    public getRoot(): ScuffrElementScriptRoot {
        return this.parent.root;
    }
}
