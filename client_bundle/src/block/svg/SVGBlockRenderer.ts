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

interface IScuffrBlockParent<T> extends ScuffrParentElement {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    get(key: T): ScuffrBlockInstanceElement | null;
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
        const block = this.parent.get(this.childKey);
        if (!block) throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}

class SVGBlockRenderContext {
    public readonly workspace: SVGRenderedWorkspace;
    public readonly attachmentPoints: BlockAttachmentPoint[];

    public constructor(workspace: SVGRenderedWorkspace, attachmentPoints: BlockAttachmentPoint[]) {
        this.workspace = workspace;
        this.attachmentPoints = attachmentPoints;
    }
}

interface ISVGBlockRenderer {
    renderBlock(block: BlockInstance, parentRef: ScuffrParentRef<unknown>, ctx: SVGBlockRenderContext): ScuffrBlockInstanceElement;
}

interface ISVGBlockTypeRenderable extends BlockType {
    getBackground(block: BlockInstance): ScuffrBackground;
}

interface IScuffrBlockPartElement extends ScuffrElement {
    getBackground?(): ScuffrBackground | null;
}

// interface IScuffrBlockInputElement extends IScuffrBlockPartElement {

// }

class ScuffrLiteralInputElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrTextElement];
    public override readonly parent: ScuffrBlockContentElement;

    public constructor(parent: ScuffrBlockContentElement, text: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), { x: 0, y: 0 }, { x: 0, y: 0 }, parent.workspace);
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
    }

    public getBackground(): ScuffrBackground {
        return this.children[0].background;
    }
}

class ScuffrBlockInstanceElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrBlockContentElement];
    public override readonly parent: IScuffrBlockParent<unknown>;
    public readonly block: BlockInstance;
    public readonly parentRef: ScuffrParentRef<unknown>;

    public get background() { return this.children[0]; }
    public get content() { return this.children[1]; }

    public constructor(parentRef: ScuffrParentRef<unknown>, block: BlockInstance, dom: SVGElement, background: ScuffrBackground) {
        super(dom, { x: 0, y: 0 }, { x: 0, y: 0 }, parentRef.parent.workspace);
        this.parent = parentRef.parent;
        this.parentRef = parentRef;
        this.block = block;
        this.children = [
            new ScuffrBackgroundElement(this, background),
            new ScuffrBlockContentElement(this)
        ];
    }

    public getBackground(): ScuffrBackground {
        return this.background.background;
    }

    public updateDimensions(dimensions: Vec2) {
        this.content.dimensions = dimensions;
        this.background.updateDimensions(this.content);
        this.dimensions = this.background.dimensions;
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }
}

class ScuffrBlockContentElement extends ScuffrParentElement implements IScuffrBlockParent<BlockInputType> {
    public children: IScuffrBlockPartElement[];
    public parent: ScuffrBlockInstanceElement;
    public inputs: Map<string, IScuffrBlockPartElement>;

    public constructor(parent: ScuffrBlockInstanceElement) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), { x: 0, y: 0 }, { x: 0, y: 0 }, parent.workspace);
        this.parent = parent;
        this.children = [];
        this.inputs = new Map();
    }

    public get(key: BlockInputType): ScuffrBlockInstanceElement | null {
        const input = this.inputs.get(key.id);
        if (input instanceof ScuffrBlockInstanceElement) return input;
        return null;
    }

    public onChildDrag?(key: BlockInputType, event: MouseEvent): boolean {
        const block = this.get(key);
        if (!block) {
            console.warn("Block instance recieved invalid key in onChildDrag.");
            return true;
        }
        this.parent.block.resetInput(key);
        this.update(block);
        this.workspace.dragRenderedBlock(this.parent, event);
        return true;
    }
}

class SVGBlockRenderer implements ISVGBlockRenderer {

    public readonly blockType: ISVGBlockTypeRenderable;

    constructor(type: ISVGBlockTypeRenderable) {
        this.blockType = type;
    }

    public renderBlock(block: BlockInstance, parentRef: ScuffrParentRef<unknown>, ctx: SVGBlockRenderContext): ScuffrBlockInstanceElement {
        if (block.type !== this.blockType)
            throw new Error(`Block renderer created for rendering ${this.blockType.id} cannot render ${block.type.id}`);

        const background = this.blockType.getBackground(block);
        const instanceElementDOM = parentRef.parent.dom.appendChild(document.createElementNS(SVG_NS, "g"));
        const instanceElement = new ScuffrBlockInstanceElement(parentRef, block, instanceElementDOM, background);

        const parts = block.type.parts;

        let x = 0;
        let height = 0;

        for (let partIdx = 0; partIdx < parts.length; partIdx++) {
            const part = parts[partIdx];

            const renderedPart = part.render(instanceElement.content, ctx);
            instanceElement.content.children.push(renderedPart);
            if (part instanceof BlockInputType)
                instanceElement.content.inputs.set(part.id, renderedPart);
            x = background.shape.prePartPadding(block, partIdx, x, renderedPart);
            renderedPart.translation.x += x;
            renderedPart.updateTraslation();
            x = background.shape.postPartPadding(block, partIdx, x, renderedPart);

            if (renderedPart.dimensions.y > height) height = renderedPart.dimensions.y;
        }


        instanceElement.updateDimensions({ x, y: height });
        return instanceElement;
    }
}

export { SVGBlockRenderer, SVGBlockRenderContext, ScuffrBlockInstanceElement, ScuffrLiteralInputElement, ScuffrBlockContentElement, ScuffrParentRef };
export type { ISVGBlockTypeRenderable as ISVGBlockRenderRenderable, ISVGBlockRenderer, IScuffrBlockPartElement, IScuffrBlockParent };