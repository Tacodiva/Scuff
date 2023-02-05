import { BlockInputType } from "../block/BlockInputType";
import type { IScruffrBlockInput } from "./IScruffrBlockInput";
import type { IScruffrBlockPartElement } from "./IScruffrBlockPartElement";
import { ScruffrBlockInstanceElement } from "./ScruffrBlockInstanceElement";
import { ScruffrBlockRef, type IScruffrBlockParent } from "./ScruffrBlockRef";
import { ScruffrParentElement } from "./ScruffrParentElement";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";

interface ScruffrBlockContentInput {
    element: IScruffrBlockInput,
    index: number
}

export class ScruffrBlockContentElement extends ScruffrParentElement implements IScruffrBlockParent<BlockInputType> {
    public children: IScruffrBlockPartElement[];
    public parent: ScruffrBlockInstanceElement;
    public inputs: Map<string, ScruffrBlockContentInput>;

    public get root() { return this.parent.root; }

    public constructor(parent: ScruffrBlockInstanceElement) {
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
        if (part instanceof BlockInputType) {
            renderedPart = part.render(this);
            this.inputs.set(part.id, { element: renderedPart, index });
            part.createAttachmentPoints(this, renderedPart);
        } else {
            renderedPart = part.render(this);
        }
        this.children[index] = (renderedPart);
        return renderedPart;
    }

    public setInput(key: BlockInputType, input: IScruffrBlockInput) {
        this.parent.block.setInput(key, input.asInput());
        const oldInput = this.getInput(key);
        if (!oldInput) throw new Error(`No input ${key.id} on block ${this.parent.block.type.id}.`);
        this.dom.replaceChild(input.dom, oldInput.element.dom);
        if (oldInput.element.onAncestryChange) oldInput.element.onAncestryChange(null);
        input.setParent(new ScruffrBlockRef(key, this));
        this.children[oldInput.index] = input;
        this.inputs.set(key.id, { element: input, index: oldInput.index });
        key.createAttachmentPoints(this, input);
        this.update(true);
    }

    public getInput(key: BlockInputType): ScruffrBlockContentInput | null {
        return this.inputs.get(key.id) ?? null;
    }

    public getBlockInstanceElement(key: BlockInputType): ScruffrBlockInstanceElement | null {
        const input = this.getInput(key);
        if (input && input.element instanceof ScruffrBlockInstanceElement)
            return input.element;
        return null;
    }

    public onChildDrag(key: BlockInputType, event: MouseEvent): boolean {
        const input = this.getInput(key);
        if (!(input && input.element instanceof ScruffrBlockInstanceElement)) {
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

    public getRoot(): ScruffrRootScriptElement {
        return this.parent.root;
    }
}