import { ScruffrParentElement } from "./ScruffrParentElement";
import type { ScruffrWorkspace } from "./ScruffrWorkspace";
import { ScruffrBlockRef, type IScruffrBlockParent } from "./ScruffrBlockRef";
import type { BlockInputTypeSubscript } from "../block/BlockInputTypeSubscript";
import { ScruffrBlockInstanceElement } from "./ScruffrBlockInstanceElement";
import { ScruffrScriptAttachmentPoint } from "./attachment_points/ScruffrScriptAttachmentPoint";
import type { IScruffrBlock } from "./IScruffrBlock";
import { ScruffrInputSubscriptElement } from "./ScruffrInputSubscriptElement";
import type { BlockScript } from "../block/BlockScript";
import { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";
import { ScruffrAttachmentPointList } from "./attachment_points/ScruffrAttachmentPointList";

export abstract class ScruffrScriptElement<TScript extends BlockScript> extends ScruffrParentElement implements IScruffrBlockParent<number> {
    public children: IScruffrBlock[];
    public readonly script: TScript;
    protected _root: ScruffrRootScriptElement | null;

    public readonly attachmentPoints: ScruffrAttachmentPointList;

    public constructor(container: SVGElement, root: ScruffrRootScriptElement | null, workspace: ScruffrWorkspace, script: TScript, blocks?: IScruffrBlock[]) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScruffrAttachmentPointList(this._root);
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
                this.children[i].setParent(new ScruffrBlockRef(i, this));
        } else {
            this.children = [];

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        }
    }

    public getRoot(): ScruffrRootScriptElement {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public getBlockInstanceElement(key: number): ScruffrBlockInstanceElement | null {
        let child = this.children[key];
        if (child instanceof ScruffrBlockInstanceElement)
            return child;
        return null;
    }

    public static getBlockInstanceElements(blocks: IScruffrBlock[]): ScruffrBlockInstanceElement[] {
        let instances = [];
        for (const child of blocks) {
            if (child instanceof ScruffrBlockInstanceElement)
                instances.push(child);
        }
        return instances;
    }

    public insertScript(index: number, script: ScruffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        this.children.splice(index, 0, ...script.children);
        if (index === 0) {
            this.translationSelf.y = this.translationSelf.y + this.topOffset - script.bottomOffset;
        }
        for (let i = 0; i < script.children.length; i++) {
            script.children[i].setParent(new ScruffrBlockRef(i + index, this));
            this.dom.appendChild(script.children[i].dom);
        }
        this.update(true);
        this.workspace.deleteRenderedScript(script, false);
    }

    public wrapScript(index: number, script: ScruffrRootScriptElement, block: ScruffrBlockInstanceElement, input: BlockInputTypeSubscript) {
        this.script.blocks.splice(index, Infinity, ...script.script.blocks);
        const newChildren = this.children.splice(index, Infinity, ...script.children);
        block.getInput(input)?.translationParent
        for (let i = 0; i < script.children.length; i++) {
            script.children[i].setParent(new ScruffrBlockRef(i + index, this));
            this.dom.appendChild(script.children[i].dom);
        }
        if (newChildren.length !== 0) {
            const newScript = new ScruffrInputSubscriptElement(block, null, newChildren);
            block.setInput(input, newScript);
        }
        this.update(true);
        this.workspace.deleteRenderedScript(script, false);
    }

    private _renderBlock(index: number) {
        return this.script.blocks[index].render(null, new ScruffrBlockRef(index, this));
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
                        this.attachmentPoints.push(new ScruffrScriptAttachmentPoint(this, 0, false, true, { x: 0, y: this.topOffset }))
                }
                if (renderedBlock.shouldAttachDown())
                    if (blockIdx === this.script.blocks.length - 1)
                        this.attachmentPoints.push(new ScruffrScriptAttachmentPoint(this, blockIdx + 1, true, false, { x: 0, y: y }))
                    else
                        this.attachmentPoints.push(new ScruffrScriptAttachmentPoint(this, blockIdx + 1, true, true, { x: 0, y }))
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
        const newScript = new ScruffrRootScriptElement(this.workspace, null, draggedBlocks);
        this.workspace.addRenderedScript(newScript);
        this.workspace.dragRenderedScript(newScript, event);
        this.update(true);
        return true;
    }

    public abstract toRootScript(): ScruffrRootScriptElement;
}