import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrAttachmentPointList, ScuffrScriptAttachmentPoint, type ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";
import { BlockScript, BlockSubscriptInput, BlockScriptRoot } from "../block/BlockScript";
import type { BlockInstance } from "../block/BlockInstance";
import type { IScuffrBackgroundModifier, ScuffrBackground, ScuffrBackgroundContentLine } from "./ScuffrBackground";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInputType, BlockInputTypeSubscript, IBlockInput } from "../block/BlockInputType";
import type { IScuffrBlockInput, ScuffrBlockContentElement, ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";

export abstract class ScuffrScriptElement<TScript extends BlockScript> extends ScuffrParentElement implements IScuffrBlockParent<number> {
    public children: ScuffrBlockInstanceElement[];
    public readonly script: TScript;
    protected _root: ScuffrRootScriptElement | null;

    public readonly attachmentPoints: ScuffrAttachmentPointList;

    public constructor(container: SVGElement, root: ScuffrRootScriptElement | null, workspace: ScuffrWorkspace, script: TScript | ScuffrBlockInstanceElement[], typeScript: { new(blocks: BlockInstance[]): TScript; }) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);

        if (script instanceof BlockScript) {
            this.children = [];
            this.script = script;

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        } else {
            this.script = new typeScript /*applause*/(script.flatMap(script => script.block));
            this.children = script;

            this.translationSelf = script[0].getAbsoluteTranslation();
            this.translationSelf.x += script[0].leftOffset;
            this.updateTraslation();

            for (const block of script)
                this.dom.appendChild(block.dom);

            this.update(true);

            for (let i = 0; i < script.length; i++)
                script[i].setParent(new ScuffrBlockRef(i, this));
        }
    }

    public getRoot(): ScuffrRootScriptElement {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public getBlock(key: number): ScuffrBlockInstanceElement | null {
        return this.children[key];
    }

    public insertScript(index: number, script: ScuffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        this.children.splice(index, 0, ...script.children);
        if (index === 0)
            this.translationSelf.y += this.topOffset - script.bottomOffset;
        for (let i = 0; i < script.children.length; i++) {
            script.children[i].setParent(new ScuffrBlockRef(i + index, this));
            this.dom.appendChild(script.children[i].dom);
        }
        this.update(true);
        this.workspace.deleteRenderedScript(script, false);
    }

    public wrapScript(index: number, script: ScuffrRootScriptElement, block: ScuffrBlockInstanceElement, input: BlockInputTypeSubscript) {
        this.script.blocks.splice(index, Infinity, ...script.script.blocks);
        const newChildren = this.children.splice(index, Infinity, ...script.children);
        for (let i = 0; i < script.children.length; i++) {
            script.children[i].setParent(new ScuffrBlockRef(i + index, this));
            this.dom.appendChild(script.children[i].dom);
        }
        if (newChildren.length !== 0) {
            const newScript = new ScuffrInputSubscriptElement(block, newChildren);
            block.setInput(input, newScript);
        }
        this.update(true);
        this.workspace.deleteRenderedScript(script, false);
    }

    private _renderBlock(index: number) {
        return this.script.blocks[index].render(null, new ScuffrBlockRef(index, this));
    }

    public override update(propagateUp: boolean) {
        this.updateTraslation();
        this.attachmentPoints.clear();

        let x = 0;
        let y = 0;

        for (let blockIdx = 0; blockIdx < this.script.blocks.length; blockIdx++) {
            const renderedBlock = this.children[blockIdx];
            renderedBlock.parentRef.childKey = blockIdx;
            const block = renderedBlock.block;

            const dimensions = renderedBlock.dimensions;
            const height = dimensions.y;
            renderedBlock.translationParent.x = 0;
            if (blockIdx === 0) {
                renderedBlock.translationParent.y = 0;
                y += height / 2;
            } else {
                const yTrans = y + height / 2;
                renderedBlock.translationParent.y = yTrans;
                y += height;
            }
            renderedBlock.updateTraslation();
            if (dimensions.x > x) x = dimensions.x

            if (blockIdx === 0) {
                if (block.type.canStackUp(block))
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, 0, false, true, { x: 0, y: - height / 2 }))
            }
            if (block.type.canStackDown(block))
                if (blockIdx === this.script.blocks.length - 1)
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, false, { x: 0, y }))
                else
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, true, { x: 0, y }))
        }

        if (this.script.blocks.length !== 0)
            this.topLeftOffset = { x: 0, y: this.children[0].dimensions.y / 2 };
        else
            this.topLeftOffset = { x: 0, y: 0 };

        this.dimensions = { x, y: y + this.topLeftOffset.y };
        super.update(propagateUp);
    }

    public onChildDrag?(key: number, event: MouseEvent): boolean {
        if (key === 0) {
            this.workspace.dragRenderedScript(this.toRootScript(), event);
            super.update(true);
            return true;
        }

        const draggedChild = this.children[key];
        const pos = draggedChild.getAbsoluteTranslation();
        pos.x += draggedChild.leftOffset;

        this.script.blocks.splice(key);
        const draggedBlocks = this.children.splice(key);
        const newScript = new ScuffrRootScriptElement(this.workspace, draggedBlocks);
        this.workspace.addRenderedScript(newScript);
        this.workspace.dragRenderedScript(newScript, event);
        this.update(true);
        return true;
    }

    public abstract toRootScript(): ScuffrRootScriptElement;
}

export class ScuffrRootScriptElement extends ScuffrScriptElement<BlockScriptRoot> {

    public readonly parent: ScuffrWorkspace;

    public constructor(workspace: ScuffrWorkspace, script: BlockScriptRoot);

    public constructor(workspace: ScuffrWorkspace, block: ScuffrBlockInstanceElement[]);

    public constructor(workspace: ScuffrWorkspace, content: BlockScriptRoot | ScuffrBlockInstanceElement[]) {
        super(workspace.svgScriptContainer, null, workspace, content, BlockScriptRoot);
        this.parent = workspace;
        if (content instanceof BlockScript)
            this.translationSelf = content.translation;
    }

    public override getRoot(): ScuffrRootScriptElement {
        return this;
    }

    public override updateTraslation() {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTraslation();
    }

    public toRootScript(): ScuffrRootScriptElement {
        return this;
    }
}

export class ScuffrInputSubscriptElement extends ScuffrScriptElement<BlockSubscriptInput> implements IScuffrBlockInput, IScuffrBackgroundModifier {
    private _parent: ScuffrBlockContentElement;
    public get parent(): ScuffrBlockContentElement { return this._parent; }

    public constructor(parent: ScuffrBlockInstanceElement, script: BlockSubscriptInput);

    public constructor(parent: ScuffrBlockInstanceElement, block: ScuffrBlockInstanceElement[]);

    public constructor(parent: ScuffrBlockInstanceElement, script: BlockSubscriptInput | ScuffrBlockInstanceElement[]) {
        super(parent.content.dom, parent.root, parent.workspace, script, BlockSubscriptInput);
        this._parent = parent.content;
    }

    public override update(propagateUp: boolean): void {
        super.update(false);
        if (this.children.length === 0) {
            this.dimensions.x = 144;
            this.dimensions.y = 32;
            this.translationSelf.x = 0;
            this.translationSelf.y = 0;
            this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, 0, true, false, { x: 8, y: -12 }))
        } else {
            this.dimensions.x = 144;
            this.dimensions.y += 8;

            this.translationSelf.x = 8;
            this.translationSelf.y = -this.dimensions.y / 2 - this.topOffset + 4;
            this.updateTraslation();
        }

        if (propagateUp && this.parent) this.parent.update(true);
    }

    public toRootScript(): ScuffrRootScriptElement {
        const rootScript = new ScuffrRootScriptElement(this.workspace, this.children);
        this.workspace.addRenderedScript(rootScript);
        this.children = [];
        this.script.blocks.length = 0;
        this.update(true);
        return rootScript;
    }

    public getBackgroundModifier(): IScuffrBackgroundModifier {
        return this;
    }

    public getPath(size: Vec2, line: ScuffrBackgroundContentLine): string | null {
        return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }

    public onAncestryChange(root: ScuffrRootScriptElement | null): void {
        this._root = root;
        for (const child of this.children) child.onAncestryChange(root);
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }

    public setParent(parentRef: ScuffrBlockRef<BlockInputType<IBlockInput>, ScuffrBlockContentElement>) {
        this._parent = parentRef.parent;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public asInput(): IBlockInput {
        return this.script;
    }
}