import { ScuffrParentElement } from "./ScuffrParentElement";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";
import type { BlockInputTypeSubscript } from "../block/BlockInputTypeSubscript";
import { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrScriptAttachmentPoint } from "./attachment_points/ScuffrScriptAttachmentPoint";
import type { IScuffrBlock } from "./IScuffrBlock";
import { ScuffrInputSubscriptElement } from "./ScuffrInputSubscriptElement";
import type { BlockScript } from "../block/BlockScript";
import { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import { ScuffrAttachmentPointList } from "./attachment_points/ScuffrAttachmentPointList";

export abstract class ScuffrScriptElement<TScript extends BlockScript> extends ScuffrParentElement implements IScuffrBlockParent<number> {
    public children: IScuffrBlock[];
    public readonly script: TScript;
    protected _root: ScuffrRootScriptElement | null;

    public readonly attachmentPoints: ScuffrAttachmentPointList;

    public constructor(container: SVGElement, root: ScuffrRootScriptElement | null, workspace: ScuffrWorkspace, script: TScript, blocks?: IScuffrBlock[]) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);
        this.script = script;

        if (blocks) {
            this.children = blocks;

            this.translationSelf = this.children[0].getAbsoluteTranslation();
            this.translationSelf.x += this.children[0].leftOffset;
            this.updateTraslation();

            for (const block of this.children)
                this.dom.appendChild(block.dom);

            this.update(true);

            for (let i = 0; i < this.children.length; i++)
                this.children[i].setParent(new ScuffrBlockRef(i, this));
        } else {
            this.children = [];

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        }
    }

    public getRoot(): ScuffrRootScriptElement {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public getBlockInstanceElement(key: number): ScuffrBlockInstanceElement | null {
        let child = this.children[key];
        if (child instanceof ScuffrBlockInstanceElement)
            return child;
        return null;
    }

    public static getBlockInstanceElements(blocks: IScuffrBlock[]): ScuffrBlockInstanceElement[] {
        let instances = [];
        for (const child of blocks) {
            if (child instanceof ScuffrBlockInstanceElement)
                instances.push(child);
        }
        return instances;
    }

    public insertScript(index: number, script: ScuffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        this.children.splice(index, 0, ...script.children);
        if (index === 0) {
            this.translationSelf.y = this.translationSelf.y + this.topOffset - script.bottomOffset;
        }
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
        block.getInput(input)?.translationParent
        for (let i = 0; i < script.children.length; i++) {
            script.children[i].setParent(new ScuffrBlockRef(i + index, this));
            this.dom.appendChild(script.children[i].dom);
        }
        if (newChildren.length !== 0) {
            const newScript = new ScuffrInputSubscriptElement(block, null, newChildren);
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

        if (this.script.blocks.length !== 0) {
            this.topLeftOffset = { x: 0, y: -this.children[0].topOffset };

            let x = 0;
            let y = this.topOffset;

            for (let blockIdx = 0; blockIdx < this.script.blocks.length; blockIdx++) {
                const renderedBlock = this.children[blockIdx];
                renderedBlock.parentRef.childKey = blockIdx;

                renderedBlock.translationParent.x = 0;
                renderedBlock.translationParent.y = y - renderedBlock.topOffset;
                y += renderedBlock.dimensions.y;
                renderedBlock.updateTraslation();
                if (renderedBlock.dimensions.x > x) x = renderedBlock.dimensions.x

                if (blockIdx === 0) {
                    if (renderedBlock.shouldAttachUp())
                        this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, 0, false, true, { x: 0, y: this.topOffset }))
                }
                if (renderedBlock.shouldAttachDown())
                    if (blockIdx === this.script.blocks.length - 1)
                        this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, false, { x: 0, y: y }))
                    else
                        this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, true, { x: 0, y }))
            }

            this.dimensions = { x, y: y - this.topOffset };
        } else {
            this.topLeftOffset = { x: 0, y: 0 };
            this.dimensions = { x: 0, y: 0 };
        }

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
        const newScript = new ScuffrRootScriptElement(this.workspace, null, draggedBlocks);
        this.workspace.addRenderedScript(newScript);
        this.workspace.dragRenderedScript(newScript, event);
        this.update(true);
        return true;
    }

    public abstract toRootScript(): ScuffrRootScriptElement;
}