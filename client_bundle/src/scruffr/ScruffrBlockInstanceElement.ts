import { ScruffrElement, ScruffrParentElement } from "./ScruffrElement";
import { ScruffrBackground, ScruffrBackgroundElement, type IScruffrBackgroundModifier, type ScruffrBackgroundContentLine } from "./ScruffrBackground";
import { BlockInputType, type IBlockInput } from "../block/BlockInputType";
import type { ScruffrRootScriptElement } from "./ScruffrScriptElement";
import { ScruffrBlockRef, type IScruffrBlockParent } from "./ScruffrBlockRef";
import type { BlockInstance } from "../block/BlockInstance";
import { ScruffrAttachmentPointList, type IScruffrPointAttachable } from "./ScruffrAttachmentPoint";

export interface IScruffrBlockPartElement extends ScruffrElement {
    getBackground?(): ScruffrBackground | null;
    onAncestryChange?(root: ScruffrRootScriptElement | null): void;
    getBackgroundModifier?(): IScruffrBackgroundModifier | null;
}

export interface IScruffrBlockInput extends IScruffrPointAttachable, IScruffrBlockPartElement, ScruffrElement {
    asInput() : IBlockInput;
    setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>) : void;
}

export abstract class ScruffrBackgroundedBlockPartElement<TContent extends ScruffrElement> extends ScruffrBackgroundElement<TContent> implements IScruffrBlockPartElement, IScruffrPointAttachable {
    public readonly attachmentPoints: ScruffrAttachmentPointList;
    public root: ScruffrRootScriptElement;

    public constructor(root: ScruffrRootScriptElement, parent: ScruffrParentElement, background: ScruffrBackground) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScruffrAttachmentPointList(root);
    }

    public getBackground(): ScruffrBackground {
        return this.background;
    }

    public onAncestryChange(root: ScruffrRootScriptElement | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }
}

export class ScruffrBlockInstanceElement extends ScruffrBackgroundedBlockPartElement<ScruffrBlockContentElement> implements IScruffrBlockInput {
    public override parent: IScruffrBlockParent;
    public readonly block: BlockInstance;
    public parentRef: ScruffrBlockRef;

    public constructor(block: BlockInstance, parentRef: ScruffrBlockRef) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.parent = parentRef.parent;
        this.parentRef = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    protected createContent(): ScruffrBlockContentElement {
        return new ScruffrBlockContentElement(this);
    }

    public setParent(parentRef: ScruffrBlockRef) {
        this.parentRef = parentRef;
        this.parent = parentRef.parent;
        const root = parentRef.parent.getRoot();
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public override onAncestryChange(root: ScruffrRootScriptElement | null): void {
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
        super.onAncestryChange(root);
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockInputType): ScruffrBlockContentInput | null {
        return this.content.getInput(key);
    }

    public setInput(key: BlockInputType, input: IScruffrBlockInput) {
        this.content.setInput(key, input);
    }

    protected override getBackgroundContentLines(): ScruffrBackgroundContentLine[] {
        const lines: ScruffrBackgroundContentLine[] = [];
        let lineContent: IScruffrBlockPartElement[] | null = null;
        for (const part of this.content.children) {
            if (part.getBackgroundModifier) {
                if (lineContent) {
                    lines.push({ elements: lineContent, dimensions: { x: 0, y: 0 } });
                    lineContent = [];
                }
                lines.push({ elements: [part], modifier: part.getBackgroundModifier() ?? undefined, dimensions: { x: 0, y: 0 } });
            } else {
                if (!lineContent) lineContent = [];
                lineContent.push(part);
            }
        }
        if (lineContent) lines.push({ elements: lineContent, dimensions: { x: 0, y: 0 } });
        return lines;
    }

    public asInput(): IBlockInput {
        return this.block;
    }
}

interface ScruffrBlockContentInput {
    element: IScruffrBlockPartElement,
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

    public getBlock(key: BlockInputType): ScruffrBlockInstanceElement | null {
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