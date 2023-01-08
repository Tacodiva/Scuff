import type { Vec2 } from "../../utils/Vec2";
import type { BlockAttachmentPoint } from "../BlockAttachmentPoint";
import type BlockInstance from "../BlockInstance";
import type { IBlockPart } from "../BlockParts";
import type BlockType from "../BlockType";
import type { SVGRenderedWorkspace } from "./SVGWorkspace";
import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { ScuffrBackground, ScuffrBackgroundElement, ScuffrBackgroundShape } from "./SVGBackgroundRenderer";
import { ScuffrTextElement } from "./SVGTextRenderer";
import { BlockInputType } from "../BlockInputType";
import type { SVGRenderedScript } from "./SVGScriptRenderer";

interface IScuffrBlockParent<T> extends ScuffrParentElement {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlock(key: T): ScuffrBlockInstanceElement | null;
    getRoot(): SVGRenderedScript;
}

class ScuffrParentRef<T> {
    public readonly childKey: T;
    public readonly parent: IScuffrBlockParent<T>;

    public constructor(key: T, container: IScuffrBlockParent<T>) {
        this.childKey = key;
        this.parent = container;
    }

    public onDrag(event: MouseEvent): boolean {
        return (this.parent.onChildDrag && this.parent.onChildDrag(this.childKey, event)) ?? false;
    }

    public get(): ScuffrBlockInstanceElement {
        const block = this.parent.getBlock(this.childKey);
        if (!block) throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}

interface ISVGBlockRenderer {
    renderBlock(block: BlockInstance, parentRef: ScuffrParentRef<unknown>, root: SVGRenderedScript): ScuffrBlockInstanceElement;
}

interface ISVGBlockTypeRenderable extends BlockType {
    getBackground(block: BlockInstance): ScuffrBackground;
}

interface IScuffrBlockPartElement extends ScuffrElement {
    getBackground?(): ScuffrBackground | null;
    setRoot?(root: SVGRenderedScript): void;
}

class ScuffrLiteralInputElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrTextElement];
    public override readonly parent: ScuffrBlockContentElement;

    public constructor(parent: ScuffrBlockContentElement, text: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [
            new ScuffrBackgroundElement(this, new ScuffrBackground(
                ScuffrBackgroundShape.ROUND_BLOCK,
                "var(--scuff-block-input-bg)",
                parent.parent.block.type.category.colorTertiary
            )),
            new ScuffrTextElement(this, text, "var(--scuff-block-input-font-fill)")
        ];
        this.children[0].updateDimensions(this.children[1]);
        this.dimensions = this.children[0].dimensions;
        this.topLeftOffset = this.children[0].topLeftOffset;
    }

    public getBackground(): ScuffrBackground {
        return this.children[0].background;
    }
}

class ScuffrBlockInstanceElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrBlockContentElement];
    public override parent: IScuffrBlockParent<unknown>;
    public root: SVGRenderedScript;
    public readonly block: BlockInstance;
    public parentRef: ScuffrParentRef<unknown>;

    public attachmentPointStart: number;
    public attachmentPointCount: number;


    public get background() { return this.children[0]; }
    public get content() { return this.children[1]; }

    public constructor(root: SVGRenderedScript, parentRef: ScuffrParentRef<unknown>, block: BlockInstance, dom: SVGElement, background: ScuffrBackground) {
        super(dom, parentRef.parent.workspace);
        this.root = root;
        this.parent = parentRef.parent;
        this.parentRef = parentRef;
        this.block = block;
        this.attachmentPointStart = root.attachmentPoints.length;
        this.attachmentPointCount = 0;
        this.children = [
            new ScuffrBackgroundElement(this, background),
            new ScuffrBlockContentElement(this)
        ];
    }

    public setParent(parentRef: ScuffrParentRef<unknown>) {
        this.parentRef = parentRef;
        this.parent = parentRef.parent;
        const root = parentRef.parent.getRoot();
        if (root !== this.root)
            this.setRoot(parentRef.parent.getRoot());
    }

    public setRoot(root: SVGRenderedScript) {
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

class ScuffrBlockContentElement extends ScuffrParentElement implements IScuffrBlockParent<BlockInputType> {
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

    public getRoot(): SVGRenderedScript {
        return this.parent.root;
    }
}

class SVGBlockRenderer implements ISVGBlockRenderer {

    public readonly blockType: ISVGBlockTypeRenderable;

    constructor(type: ISVGBlockTypeRenderable) {
        this.blockType = type;
    }

    public renderBlock(block: BlockInstance, parentRef: ScuffrParentRef<unknown>, root: SVGRenderedScript): ScuffrBlockInstanceElement {
        if (block.type !== this.blockType)
            throw new Error(`Block renderer created for rendering ${this.blockType.id} cannot render ${block.type.id}`);

        const background = this.blockType.getBackground(block);
        const instanceElementDOM = parentRef.parent.dom.appendChild(document.createElementNS(SVG_NS, "g"));
        const instanceElement = new ScuffrBlockInstanceElement(root, parentRef, block, instanceElementDOM, background);

        const parts = block.type.parts;

        let x = 0;
        let height = 0;

        for (let partIdx = 0; partIdx < parts.length; partIdx++) {
            const part = parts[partIdx];

            const renderedPart = part.render(instanceElement.content, root);
            const renderedPartIdx = instanceElement.content.children.push(renderedPart);
            if (part instanceof BlockInputType)
                instanceElement.content.inputs.set(part.id, { element: renderedPart, index: renderedPartIdx });
            x = background.shape.prePartPadding(block, partIdx, x, renderedPart);
            renderedPart.translation.x += x;
            renderedPart.updateTraslation();
            x = background.shape.postPartPadding(block, partIdx, x, renderedPart);

            if (renderedPart.dimensions.y > height) height = renderedPart.dimensions.y;
        }


        instanceElement.updateDimensions({ x, y: height });
        instanceElement.attachmentPointCount = root.attachmentPoints.length - instanceElement.attachmentPointStart;
        return instanceElement;
    }
}

export { SVGBlockRenderer, ScuffrBlockInstanceElement, ScuffrLiteralInputElement, ScuffrBlockContentElement, ScuffrParentRef };
export type { ISVGBlockTypeRenderable as ISVGBlockRenderRenderable, ISVGBlockRenderer, IScuffrBlockPartElement, IScuffrBlockParent };