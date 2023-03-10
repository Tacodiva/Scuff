import { ScuffrElementScriptInput } from "./ScuffrElementScriptInput";
import { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrBlockReference, type ScuffrBlockReferenceParent } from "./ScuffrBlockReference";
import { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import { ScuffrAttachmentPointScript } from "./attachment-points/ScuffrAttachmentPointScript";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { BlockScript } from "../block/BlockScript";
import { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrElementBlockGhost } from "./ScuffrElementBlockGhost";
import { ScuffrAttachmentPointScriptTop } from "./attachment-points/ScuffrAttachmentPointScriptTop";
import { ScuffrWrappingDescriptor } from "./ScuffrWrappingDescriptor";
import type { Vec2 } from "../utils/Vec2";
import { ScuffrInteractionDragScript } from "./interactions/ScuffrInteractionDragScript";

export abstract class ScuffrElementScript<TScript extends BlockScript = BlockScript> extends ScuffrElementParent implements ScuffrBlockReferenceParent<number> {
    public children: ScuffrElementBlock[];
    public readonly script: TScript;
    protected _root: ScuffrElementScriptRoot | null;
    protected _ghost: ScuffrElementBlockGhost | null;
    public get ghost(): ScuffrElementBlockGhost | null { return this._ghost };

    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public abstract readonly isSubscript: boolean;

    public constructor(container: SVGElement, root: ScuffrElementScriptRoot | null, workspace: ScuffrWorkspace, script: TScript, blocks?: ScuffrElementBlock[], translation?: Vec2) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace, translation);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);
        this.script = script;
        this._ghost = null;

        if (blocks) {
            this.children = blocks;

            for (let i = 0; i < this.children.length; i++) {
                const block = this.children[i];
                this.dom.appendChild(block.dom);
                block.setParent(new ScuffrBlockReference(i, this));
            }

            this.updateTranslation();
            this.update(true);
        } else {
            this.children = [];

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        }
    }

    public getRoot(): ScuffrElementScriptRoot {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public getBlockElement(key: number): ScuffrElementBlock {
        return this.children[key];
    }

    public static getBlockInstanceElements(blocks: ScuffrElementBlock[]): ScuffrElementBlockInstance[] {
        let instances = [];
        for (const child of blocks) {
            if (child instanceof ScuffrElementBlockInstance)
                instances.push(child);
        }
        return instances;
    }

    public tryWrap(index: number, wrapper: ScuffrElementBlock): ScuffrWrappingDescriptor | null {
        return ScuffrWrappingDescriptor.tryWrap(this, index, wrapper);
    }

    public override updateAll(): void {
        super.updateAll();
        this.updateTranslation(false);
    }

    public insertScript(index: number, script: ScuffrElementScriptRoot, wrap?: ScuffrWrappingDescriptor | null) {
        if (wrap) {
            this.script.blocks.splice(index, Infinity, ...script.script.blocks);
            const newChildren = this.children.splice(index, Infinity, ...script.children);
            for (let i = 0; i < script.children.length; i++) {
                script.children[i].setParent(new ScuffrBlockReference(i + index, this));
                this.dom.appendChild(script.children[i].dom);
            }
            if (newChildren.length !== 0) {
                const newScript = new ScuffrElementScriptInput(wrap.wrapperBlock, null, newChildren);
                wrap.wrapperBlock.setInput(wrap.wrapperInput, newScript);
            }
            this.update(true);
            if (!this.isSubscript && index === 0) {
                this.translationSelf.x -= wrap.renderOffset.x;
                this.translationSelf.y -= wrap.renderOffset.y + 4;
                this.updateTranslation();
            }
            this.workspace.deleteRenderedScript(script, false);
        } else {
            this.script.blocks.splice(index, 0, ...script.script.blocks);
            this.children.splice(index, 0, ...script.children);
            for (let i = 0; i < script.children.length; i++) {
                script.children[i].setParent(new ScuffrBlockReference(i + index, this));
                this.dom.appendChild(script.children[i].dom);
            }
            this.update(true);
            if (!this.isSubscript && index === 0) {
                this.translationSelf.y += this.topOffset - script.bottomOffset;
                this.updateTranslation();
            }
            this.workspace.deleteRenderedScript(script, false);
        }
    }

    public addGhost(index: number, source: ScuffrElementBlockInstance, wrap?: ScuffrWrappingDescriptor | null) {
        this._ghost = new ScuffrElementBlockGhost(new ScuffrBlockReference(index, this), source, wrap);
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
        return this.script.blocks[index].render(null, new ScuffrBlockReference(index, this));
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

    public onChildDrag?(key: number, event: MouseEvent): boolean {
        if (key === 0) {
            this.workspace.startInteraction(new ScuffrInteractionDragScript(this.toRootScript(), event));
            super.update(true);
            return true;
        }

        const draggedChild = this.children[key];
        const pos = { ...draggedChild.getAbsoluteTranslation() };
        pos.x += draggedChild.leftOffset;

        this.script.blocks.splice(key);
        const draggedBlocks = this.children.splice(key);
        const newScript = new ScuffrElementScriptRoot(this.workspace, null, draggedBlocks, pos);

        this.workspace.addRenderedScript(newScript);
        this.workspace.startInteraction(new ScuffrInteractionDragScript(newScript, event));
        this.update(true);
        return true;
    }

    public abstract toRootScript(): ScuffrElementScriptRoot;
}