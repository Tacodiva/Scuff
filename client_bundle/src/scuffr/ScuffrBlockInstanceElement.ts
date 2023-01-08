import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { ScuffrBackground, ScuffrBackgroundElement, ScuffrBackgroundShape } from "./ScuffrBackground";
import { BlockInputType } from "../block/BlockInputType";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import type { IScuffrBlockParent, ScuffrBlockRef } from "./ScuffrBlockRef";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInstance } from "../block/BlockInstance";

export interface IScuffrBlockPartElement extends ScuffrElement {
    getBackground?(): ScuffrBackground | null;
    setRoot?(root: ScuffrRootScriptElement): void;
}

export class ScuffrBlockInstanceElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrBlockContentElement];
    public override parent: IScuffrBlockParent;
    public root: ScuffrRootScriptElement;
    public readonly block: BlockInstance;
    public parentRef: ScuffrBlockRef;

    public attachmentPointStart: number;
    public attachmentPointCount: number;

    public get background() { return this.children[0]; }
    public get content() { return this.children[1]; }

    public constructor(block: BlockInstance, parentRef: ScuffrBlockRef, root: ScuffrRootScriptElement) {
        super(parentRef.parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parentRef.parent.workspace);
        
        const background = block.type.getBackground(block);

        this.root = root;
        this.parent = parentRef.parent;
        this.parentRef = parentRef;
        this.block = block;
        this.attachmentPointStart = root.attachmentPoints.length;
        this.children = [
            new ScuffrBackgroundElement(this, background),
            new ScuffrBlockContentElement(this)
        ];

        const parts = block.type.parts;

        let x = 0;
        let height = 0;

        for (let partIdx = 0; partIdx < parts.length; partIdx++) {
            const part = parts[partIdx];

            const renderedPart = part.render(this.content, root);
            const renderedPartIdx = this.content.children.push(renderedPart);
            if (part instanceof BlockInputType)
                this.content.inputs.set(part.id, { element: renderedPart, index: renderedPartIdx });
            x = background.shape.prePartPadding(block, partIdx, x, renderedPart);
            renderedPart.translation.x += x;
            renderedPart.updateTraslation();
            x = background.shape.postPartPadding(block, partIdx, x, renderedPart);

            if (renderedPart.dimensions.y > height) height = renderedPart.dimensions.y;
        }


        this.updateDimensions({ x, y: height });
        this.attachmentPointCount = root.attachmentPoints.length - this.attachmentPointStart;
        return this;
    }

    public setParent(parentRef: ScuffrBlockRef) {
        this.parentRef = parentRef;
        this.parent = parentRef.parent;
        const root = parentRef.parent.getRoot();
        if (root !== this.root)
            this.setRoot(parentRef.parent.getRoot());
    }

    public setRoot(root: ScuffrRootScriptElement) {
        this.root = root;
        for (const child of this.content.children) {
            if (child.setRoot) child.setRoot(root);
        }
    }

    public getBackground(): ScuffrBackground {
        return this.background.background;
    }

    public updateDimensions(dimensions: Vec2) {
        this.content.dimensions = dimensions;
        this.content.topLeftOffset = { x: 0, y: dimensions.y / 2 };
        this.background.updateDimensions(this.content);
        this.dimensions = this.background.dimensions;
        this.topLeftOffset = this.background.topLeftOffset;
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockInputType): ScuffrBlockContentInput | null {
        return this.content.getInput(key);
    }

    public setInput(key: BlockInputType, block: ScuffrBlockInstanceElement) {
        const oldInput = this.getInput(key);
        if (!oldInput) throw new Error(`No input ${key.id} on block ${this.block.type.id}.`)
        this.block.setInput(key, block.block);
        this.update(block);
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

    public constructor(parent: ScuffrBlockInstanceElement) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [];
        this.inputs = new Map();
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
        // this.children.splice(input.index);
        this.workspace.dragRenderedBlock(input.element, event);
        this.parent.block.resetInput(key);
        this.update(input.element);
        return true;
    }

    public getRoot(): ScuffrRootScriptElement {
        return this.parent.root;
    }
}