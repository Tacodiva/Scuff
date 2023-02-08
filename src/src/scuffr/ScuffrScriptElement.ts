import { ScuffrParentElement } from "./ScuffrParentElement";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";
import { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrScriptAttachmentPoint } from "./attachment_points/ScuffrScriptAttachmentPoint";
import type { IScuffrBlock } from "./IScuffrBlock";
import { ScuffrInputSubscriptElement } from "./ScuffrInputSubscriptElement";
import type { BlockScript } from "../block/BlockScript";
import { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import { ScuffrAttachmentPointList } from "./attachment_points/ScuffrAttachmentPointList";
import { ScuffrBlockGhostElement } from "./ScuffrBlockGhostElement";
import { ScuffrScriptTopAttachmentPoint } from "./attachment_points/ScuffrScriptTopAttachmentPoint";
import type { ScuffrBlockContentInput } from "./ScuffrBlockContentElement";
import { ScuffrWrappingDescriptor } from "./ScuffrWrappingDescriptor";

export abstract class ScuffrScriptElement<TScript extends BlockScript = BlockScript> extends ScuffrParentElement implements IScuffrBlockParent<number> {
    public children: IScuffrBlock[];
    public readonly script: TScript;
    protected _root: ScuffrRootScriptElement | null;
    protected _ghost: ScuffrBlockGhostElement | null;
    public get ghost(): ScuffrBlockGhostElement | null { return this._ghost };

    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public abstract readonly isSubscript: boolean;

    public constructor(container: SVGElement, root: ScuffrRootScriptElement | null, workspace: ScuffrWorkspace, script: TScript, blocks?: IScuffrBlock[]) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);
        this.script = script;
        this._ghost = null;

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

    public getBlockElement(key: number): IScuffrBlock {
        return this.children[key];
    }

    public static getBlockInstanceElements(blocks: IScuffrBlock[]): ScuffrBlockInstanceElement[] {
        let instances = [];
        for (const child of blocks) {
            if (child instanceof ScuffrBlockInstanceElement)
                instances.push(child);
        }
        return instances;
    }

    public tryWrap(index: number, wrapper: IScuffrBlock): ScuffrWrappingDescriptor | null {
        return ScuffrWrappingDescriptor.tryWrap(this, index, wrapper);
    }

    public insertScript(index: number, script: ScuffrRootScriptElement, wrap?: ScuffrWrappingDescriptor | null) {
        if (wrap) {
            this.script.blocks.splice(index, Infinity, ...script.script.blocks);
            const newChildren = this.children.splice(index, Infinity, ...script.children);
            if (!this.isSubscript && index === 0) {
                this.translationSelf.x -= wrap.renderOffset.x;
                this.translationSelf.y -= wrap.renderOffset.y + 4;
            }
            for (let i = 0; i < script.children.length; i++) {
                script.children[i].setParent(new ScuffrBlockRef(i + index, this));
                this.dom.appendChild(script.children[i].dom);
            }
            if (newChildren.length !== 0) {
                const newScript = new ScuffrInputSubscriptElement(wrap.wrapperBlock, null, newChildren);
                wrap.wrapperBlock.setInput(wrap.wrapperInput, newScript);
            }
            this.update(true);
            this.workspace.deleteRenderedScript(script, false);
        } else {
            this.script.blocks.splice(index, 0, ...script.script.blocks);
            this.children.splice(index, 0, ...script.children);
            if (!this.isSubscript && index === 0)
                this.translationSelf.y += this.topOffset - script.bottomOffset;
            for (let i = 0; i < script.children.length; i++) {
                script.children[i].setParent(new ScuffrBlockRef(i + index, this));
                this.dom.appendChild(script.children[i].dom);
            }
            this.update(true);
            this.workspace.deleteRenderedScript(script, false);
        }
    }

    public addGhost(index: number, source: ScuffrBlockInstanceElement, wrap?: ScuffrWrappingDescriptor | null) {
        this._ghost = new ScuffrBlockGhostElement(new ScuffrBlockRef(index, this), source, wrap);
        this.children.splice(index, 0, this._ghost);
        this._updateBlocks();
        super.update(true);
    }

    public removeGhost() {
        if (this._ghost) {
            this.children.splice(this._ghost.index, 1);
            this.dom.removeChild(this._ghost.dom);
            this._ghost = null;
            this._updateBlocks();
            super.update(true);
        }
    }

    private _renderBlock(index: number) {
        return this.script.blocks[index].render(null, new ScuffrBlockRef(index, this));
    }

    public override update(propagateUp: boolean) {
        this._updateBlocks();
        this._updateAttachmentPoints();
        super.update(propagateUp);
    }

    protected _updateBlocks() {
        this.updateTraslation();
        if (this.children.length !== 0) {
            this.topLeftOffset = { x: 0, y: 0 };

            if (this._ghost?.index === 0 && this.children.length > 1) {
                if (this.isSubscript) {
                    this.topLeftOffset.y = -this.children[1].topOffset;
                } else {
                    if (this._ghost.wrapping) {
                        this.topLeftOffset.x = this._ghost.wrapping.renderOffset.x;
                        this.topLeftOffset.y = -this.children[1].topOffset + this._ghost.wrapping.renderOffset.y;
                    } else {
                        this.topLeftOffset.y = this._ghost.dimensions.y - this.children[1].topOffset;
                    }
                }
            } else {
                this.topLeftOffset.y = -this.children[0].topOffset;
            }

            let width = 0;
            let height: number | null = null;

            let x = this.leftOffset;
            let y = this.topOffset;

            for (let blockIdx = 0; blockIdx < this.children.length; blockIdx++) {
                const renderedBlock = this.children[blockIdx];
                renderedBlock.parentRef.childKey = blockIdx;

                renderedBlock.translationParent.x = x;
                renderedBlock.translationParent.y = y - renderedBlock.topOffset;

                if (this._ghost?.wrapping && blockIdx === this._ghost.index) {
                    height = y + this._ghost.dimensions.y;
                    x += this._ghost.wrapping.renderOffset.x;
                    y += this._ghost.wrapping.renderOffset.y;
                } else {
                    y += renderedBlock.dimensions.y;
                }

                renderedBlock.updateTraslation();
                if (renderedBlock.dimensions.x > width) width = renderedBlock.dimensions.x
            }

            if (!height) height = y;

            this.dimensions = { x: width, y: height - this.topOffset };
        } else {
            this.topLeftOffset = { x: 0, y: 0 };
            this.dimensions = { x: 0, y: 0 };
        }
    }

    protected _updateAttachmentPoints() {
        this.attachmentPoints.clear();
        let y = this.topOffset;

        for (let blockIdx = 0; blockIdx < this.children.length; blockIdx++) {
            const renderedBlock = this.children[blockIdx];

            y += renderedBlock.dimensions.y;

            if (blockIdx === 0) {
                if (renderedBlock.shouldAttachUp()) {
                    const offset = { x: 0, y: this.topOffset };
                    if (!this.isSubscript)
                        this.attachmentPoints.push(new ScuffrScriptTopAttachmentPoint(this, offset));
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, 0, false, true, offset));
                }
            }
            if (renderedBlock.shouldAttachDown() || (blockIdx + 1 < this.children.length && this.children[blockIdx + 1].shouldAttachUp()))
                if (blockIdx === this.script.blocks.length - 1)
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, false, { x: 0, y: y }))
                else
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this, blockIdx + 1, true, true, { x: 0, y }))
        }
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