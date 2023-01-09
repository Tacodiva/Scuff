import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { BlockScript } from "../block/BlockScript";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrAttachmentPointList, ScuffrScriptAttachmentPoint, type ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";

export class ScuffrRootScriptElement extends ScuffrParentElement implements IScuffrBlockParent<number> {

    public readonly children: ScuffrBlockInstanceElement[];
    public readonly parent: ScuffrWorkspace;

    public readonly script: BlockScript;
    public readonly attachmentPoints: ScuffrAttachmentPointList;

    public constructor(workspace: ScuffrWorkspace, script: BlockScript);

    public constructor(workspace: ScuffrWorkspace, block: ScuffrBlockInstanceElement);

    public constructor(workspace: ScuffrWorkspace, content: BlockScript | ScuffrBlockInstanceElement) {
        super(workspace.svgScriptContainer.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        this.attachmentPoints = new ScuffrAttachmentPointList(this);
        this.parent = workspace;

        if (content instanceof BlockScript) {
            this.children = [];
            this.script = content;

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        } else {
            this.script = new BlockScript([content.block]);
            const oldRoot = content.root;

            this.children = [content];
            this.dimensions = content.dimensions;
            this.script.translation = content.getAbsoluteTranslation();
            this.script.translation.x += content.leftOffset;
            this.updateTraslation();

            this.dom.appendChild(content.dom);

            content.translationParent = { x: 0, y: 0 };
            content.updateTraslation();

            this.update();

            content.setParent(new ScuffrBlockRef(0, this));
        }
    }

    public insertScript(index: number, script: ScuffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        for (let i = index; i < index + script.script.blocks.length; i++) {
            const rendered = this._renderBlock(i);
            rendered.updateAll();
            this.children.splice(i, 0, rendered);
        }
        if (index === 0)
            this.script.translation.y += this.topOffset - script.bottomOffset;
        this.workspace.deleteRenderedScript(script);
        this.update();
    }

    private _renderBlock(index: number) {
        return this.script.blocks[index].render(null, new ScuffrBlockRef(index, this));
    }

    public override update(propagateUp?: boolean) {
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
            if (blockIdx === 0) {
                y += height / 2;
            } else {
                const yTrans = y + height / 2;
                renderedBlock.translationParent.y = yTrans;
                renderedBlock.updateTraslation();
                y += height;
            }
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

        this.topLeftOffset = { x: 0, y: this.children[0].dimensions.y / 2 };
        this.dimensions = { x, y: y + this.topLeftOffset.y };
    }

    public override updateTraslation() {
        this.translationSelf.x = this.script.translation.x;
        this.translationSelf.y = this.script.translation.y;
        super.updateTraslation();
    }

    public onChildDrag?(key: number, event: MouseEvent): boolean {
        if (key === 0) {
            this.workspace.dragRenderedScript(this, event);
            return true;
        }

        const draggedChild = this.children[key];
        const pos = draggedChild.getAbsoluteTranslation();
        pos.x += draggedChild.leftOffset;

        const newScriptBlocks = this.script.blocks.splice(key);
        for (let i = key; i < this.children.length; i++) {
            this.children[i].dom.remove();
            this.children[i].onAncestryChange(null);
        }
        this.children.splice(key);
        this.update();
        const newScript = new BlockScript(newScriptBlocks, pos);
        const newRenderedScript = this.workspace.addScript(newScript);
        this.workspace.dragRenderedScript(newRenderedScript, event);
        return true;
    }

    public remove() {
        for (const child of this.children)
            child.onAncestryChange(null);
        this.dom.remove();
        this.attachmentPoints.delete();
    }

    public getBlock(key: number): ScuffrBlockInstanceElement | null {
        return this.children[key];
    }

    public getRoot(): ScuffrRootScriptElement {
        return this;
    }
}