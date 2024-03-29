import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import { ScuffrSvgBlockInstance } from "./ScuffrSvgBlockInstance";
import { ScuffrAttachmentPointScript } from "../attachment-points/ScuffrAttachmentPointScript";
import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import type { BlockScript } from "../../block/BlockScript";
import { ScuffrAttachmentPointList } from "../attachment-points/ScuffrAttachmentPointList";
import { ScuffrSvgBlockGhost } from "./ScuffrSvgBlockGhost";
import { ScuffrAttachmentPointScriptTop } from "../attachment-points/ScuffrAttachmentPointScriptTop";
import type { Vec2 } from "../../utils/Vec2";
import { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";
import type { ScuffrReference, ScuffrReferenceLink } from "../ScuffrReference";
import type { ScuffrReferenceBlock } from "../ScuffrReferenceTypes";
import { ScuffrCmdScriptSelectScriptBlocks } from "../commands";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";

export abstract class ScuffrSvgScript<TScript extends BlockScript = BlockScript> extends ScuffrSvgElementParent implements ScuffrReferenceLink<ScuffrSvgBlock> {
    public children: ScuffrSvgBlock[];
    public readonly script: TScript;
    protected _root: ScuffrSvgScriptRoot | null;
    protected _ghost: ScuffrSvgBlockGhost | null;
    public get ghost(): ScuffrSvgBlockGhost | null { return this._ghost };
    public readonly scriptContainer: ScuffrElementScriptContainer;

    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public abstract readonly isSubscript: boolean;

    public constructor(container: SVGElement, root: ScuffrSvgScriptRoot | null, scriptContainer: ScuffrElementScriptContainer, script: TScript, translation?: Vec2) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), scriptContainer.workspace, translation);
        this.scriptContainer = scriptContainer;
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);
        this.script = script;
        this._ghost = null;
        this.children = [];
    }

    protected _init(blocks?: ScuffrSvgBlock[]) {
        if (blocks) {
            this.children = blocks;

            for (let i = 0; i < this.children.length; i++) {
                const block = this.children[i];
                this.dom.appendChild(block.dom);
                block.setParent({ index: i, parent: this });
            }

            this.updateTranslation();
            this.update(true);
        } else {
            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        }
    }

    public getReferenceValue(index: number): ScuffrSvgBlock {
        return this.children[index];
    }

    public abstract getReference(): ScuffrReference;

    public getRoot(): ScuffrSvgScriptRoot {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public static getBlockInstanceElements(blocks: ScuffrSvgBlock[]): ScuffrSvgBlockInstance[] {
        let instances = [];
        for (const child of blocks) {
            if (child instanceof ScuffrSvgBlockInstance)
                instances.push(child);
        }
        return instances;
    }

    public override updateAll(): void {
        super.updateAll();
        this.updateTranslation(false);
    }

    public addGhost(index: number, source: ScuffrSvgBlockInstance, tryWrap: boolean) {
        this._ghost = new ScuffrSvgBlockGhost({ index, parent: this }, source, tryWrap);
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

    private _renderBlock(index: number): ScuffrSvgBlockInstance {
        return this.script.blocks[index].render({ index, parent: this });
    }

    public override update(propagateUp: boolean) {
        this._updateBlocks();
        this._updateAttachmentPoints();
        super.update(propagateUp);
    }

    protected _updateBlocks() {
        if (this.children.length !== 0) {
            this.topLeftOffset = { x: 0, y: 0 };

            if (this._ghost?.index === 0 && this.children.length > 1) {
                if (this.isSubscript) {
                    this.topLeftOffset.y = -this.children[1].topOffset;
                } else {
                    if (this._ghost.wrapping) {
                        this.topLeftOffset.x = this._ghost.wrapping.renderOffset.x;
                        this.topLeftOffset.y = this._ghost.wrapping.renderOffset.y - this.children[1].topOffset;
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
                renderedBlock.getReference().index = blockIdx;

                renderedBlock.translationParent.x = x;
                renderedBlock.translationParent.y = y - renderedBlock.topOffset;

                if (this._ghost?.wrapping && blockIdx === this._ghost.index) {
                    height = y + this._ghost.dimensions.y;
                    x += this._ghost.wrapping.renderOffset.x;
                    y += this._ghost.wrapping.renderOffset.y;
                } else {
                    y += renderedBlock.dimensions.y;
                }

                renderedBlock.updateTranslation();
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
        let x = 0;
        let y = this.topOffset;

        let ignoreFirst = false;

        if (this._ghost?.index === 0) {
            ignoreFirst = true;
            if (this._ghost.wrapping) {
                x += this.ghost!.wrapping!.renderOffset.x;
                y += this.ghost!.wrapping!.renderOffset.y;
            } else {
                y += this.ghost!.dimensions.y;
            }
        }

        for (let blockIdx = 0; blockIdx < this.children.length; blockIdx++) {
            if (this._ghost?.index === blockIdx) continue;
            const renderedBlock = this.children[blockIdx];

            if (blockIdx === 0 || (blockIdx === 1 && ignoreFirst)) {
                if (renderedBlock.shouldAttachUp()) {
                    if (!this.isSubscript)
                        this.attachmentPoints.push(new ScuffrAttachmentPointScriptTop(this, { x, y }));
                    this.attachmentPoints.push(new ScuffrAttachmentPointScript(this, 0, this.isSubscript, true, { x, y }));
                }
            }

            y += renderedBlock.dimensions.y;

            if (renderedBlock.shouldAttachDown() || (blockIdx + 1 < this.children.length && this.children[blockIdx + 1].shouldAttachUp()))
                if (blockIdx === this.script.blocks.length - 1)
                    this.attachmentPoints.push(new ScuffrAttachmentPointScript(this, blockIdx + 1, true, false, { x, y }))
                else
                    this.attachmentPoints.push(new ScuffrAttachmentPointScript(this, blockIdx + 1, true, true, { x, y }))
        }
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        this.attachmentPoints.recalculateTranslation();
    }

    public spliceBlocks(start: number, deleteCount?: number, items?: ScuffrSvgBlock[], update: boolean = true): ScuffrSvgBlock[] {
        let splicedChildren;

        if (!items || items.length === 0) {
            splicedChildren = this.children.splice(start, deleteCount);
            this.script.blocks.splice(start, deleteCount);
        } else {
            splicedChildren = this.children.splice(start, deleteCount ?? 0, ...items);
            this.script.blocks.splice(start, deleteCount ?? 0, ...items.map(ele => (<ScuffrSvgBlockInstance>ele).block));

            for (let i = 0; i < items.length; i++) {
                items[i].setParent({ index: i + start, parent: this });
                this.dom.appendChild(items[i].dom);
            }
        }

        for (const splicedChild of splicedChildren)
            splicedChild.dom.remove();

        if (update)
            this.update(true);

        return splicedChildren;
    }

    public onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean {
        const draggedChild = this.children[reference.index];
        const pos = { ...draggedChild.getAbsoluteTranslation() };
        pos.x += draggedChild.leftOffset;

        new ScuffrInteractionDragScript(
            new ScuffrCmdScriptSelectScriptBlocks(
                this.getReference(),
                reference.index, Infinity,
                pos
            ), event).start();
        return true;
    }
}