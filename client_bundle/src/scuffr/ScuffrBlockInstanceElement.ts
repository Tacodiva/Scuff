import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { ScuffrBackground, ScuffrBackgroundElement, type IScuffrBackgroundModifier, type ScuffrBackgroundContentLine } from "./ScuffrBackground";
import { BlockInputType } from "../block/BlockInputType";
import type { ScuffrRootScriptElement } from "./ScuffrScriptElement";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";
import type { BlockInstance } from "../block/BlockInstance";
import { ScuffrAttachmentPointList, type IScuffrPointAttachable } from "./ScuffrAttachmentPoint";

export interface IScuffrBlockPartElement extends ScuffrElement {
    getBackground?(): ScuffrBackground | null;
    onAncestryChange?(root: ScuffrRootScriptElement | null): void;
    getBackgroundModifier?(): IScuffrBackgroundModifier | null;
}

export abstract class ScuffrBackgroundedBlockPartElement<TContent extends ScuffrElement> extends ScuffrBackgroundElement<TContent> implements IScuffrBlockPartElement, IScuffrPointAttachable {
    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public root: ScuffrRootScriptElement;

    public constructor(root: ScuffrRootScriptElement, parent: ScuffrParentElement, background: ScuffrBackground) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScuffrAttachmentPointList(root);
    }

    public getBackground(): ScuffrBackground {
        return this.background;
    }

    public onAncestryChange(root: ScuffrRootScriptElement | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }
}

export class ScuffrBlockInstanceElement extends ScuffrBackgroundedBlockPartElement<ScuffrBlockContentElement> {
    public override parent: IScuffrBlockParent;
    public readonly block: BlockInstance;
    public parentRef: ScuffrBlockRef;

    public constructor(block: BlockInstance, parentRef: ScuffrBlockRef) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.parent = parentRef.parent;
        this.parentRef = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    protected createContent(): ScuffrBlockContentElement {
        return new ScuffrBlockContentElement(this);
    }

    public setParent(parentRef: ScuffrBlockRef) {
        this.parentRef = parentRef;
        this.parent = parentRef.parent;
        const root = parentRef.parent.getRoot();
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public override onAncestryChange(root: ScuffrRootScriptElement | null): void {
        super.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockInputType): ScuffrBlockContentInput | null {
        return this.content.getInput(key);
    }

    public setInput(key: BlockInputType, block: ScuffrBlockInstanceElement) {
        this.content.setInput(key, block);
    }

    protected override getBackgroundContentLines(): ScuffrBackgroundContentLine[] {
        const lines: ScuffrBackgroundContentLine[] = [];
        let lineContent: IScuffrBlockPartElement[] | null = null;
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
}

interface ScuffrBlockContentInput {
    element: IScuffrBlockPartElement,
    index: number
}

export class ScuffrBlockContentElement extends ScuffrParentElement implements IScuffrBlockParent<BlockInputType> {
    public children: IScuffrBlockPartElement[];
    public parent: ScuffrBlockInstanceElement;
    public inputs: Map<string, ScuffrBlockContentInput>;

    public get root() { return this.parent.root; }

    public constructor(parent: ScuffrBlockInstanceElement) {
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
        const renderedPart = part.render(this, this.root);
        this.children[index] = (renderedPart);
        if (part instanceof BlockInputType)
            this.inputs.set(part.id, { element: renderedPart, index });
        return renderedPart;
    }

    public setInput(key: BlockInputType, block: ScuffrBlockInstanceElement) {
        this.parent.block.setInput(key, block.block);
        const oldInput = this.getInput(key);
        if (!oldInput) throw new Error(`No input ${key.id} on block ${this.parent.block.type.id}.`);
        this.dom.replaceChild(block.dom, oldInput.element.dom);
        if (oldInput.element.onAncestryChange) oldInput.element.onAncestryChange(null);
        block.setParent(new ScuffrBlockRef(key, this));
        this.children[oldInput.index] = block;
        this.inputs.set(key.id, { element: block, index: oldInput.index });
        this.update(true);
    }

    public getInput(key: BlockInputType): ScuffrBlockContentInput | null {
        return this.inputs.get(key.id) ?? null;
    }

    public getBlock(key: BlockInputType): ScuffrBlockInstanceElement | null {
        const input = this.getInput(key);
        if (input && input.element instanceof ScuffrBlockInstanceElement)
            return input.element;
        return null;
    }

    public onChildDrag(key: BlockInputType, event: MouseEvent): boolean {
        const input = this.getInput(key);
        if (!(input && input.element instanceof ScuffrBlockInstanceElement)) {
            console.warn("Block instance recieved invalid key in onChildDrag.");
            return true;
        }
        input.element.attachmentPoints.clear();
        this.workspace.dragRenderedBlock(input.element, event);
        this.parent.block.resetInput(key);
        this._renderPart(input.index).updateAll();
        this.update(true);
        return true;
    }

    public getRoot(): ScuffrRootScriptElement {
        return this.parent.root;
    }
}