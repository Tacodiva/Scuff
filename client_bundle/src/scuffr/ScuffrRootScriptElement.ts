import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { BlockScript } from "../block/BlockScript";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import type { BlockAttachmentPoint } from "../block/BlockAttachmentPoint";
import { ScuffrScriptAttachmentPoint, type ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";

export class ScuffrRootScriptElement extends ScuffrParentElement implements IScuffrBlockParent<number> {

    public readonly children: ScuffrBlockInstanceElement[];
    public readonly parent: ScuffrWorkspace;

    public readonly script: BlockScript;
    public readonly attachmentPoints: ScuffrAttachmentPoint[];

    public constructor(workspace: ScuffrWorkspace, script: BlockScript);
    public constructor(workspace: ScuffrWorkspace, block: ScuffrBlockInstanceElement);

    public constructor(workspace: ScuffrWorkspace, content: BlockScript | ScuffrBlockInstanceElement) {
        super(workspace.scriptContainer.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        this.parent = workspace;

        if (content instanceof BlockScript) {
            this.children = [];
            this.script = content;
            this.attachmentPoints = [];
            this.update();
        } else {
            this.script = new BlockScript([content.block]);
            const oldRoot = content.root;

            this.children = [content];
            this.dimensions = content.dimensions;
            this.script.translation = content.getAbsoluteTranslation();
            this.updateTransform();

            content.setParent(new ScuffrBlockRef(0, this));
            this.dom.appendChild(content.dom);

            content.translation = { x: 0, y: 0 };
            content.updateTraslation();

            this.attachmentPoints = oldRoot.attachmentPoints.splice(content.attachmentPointStart, content.attachmentPointCount);
            for (const attachmentPoint of this.attachmentPoints) attachmentPoint.recalculateTranslation();
            content.attachmentPointStart = 0;
            content.attachmentPointCount = this.attachmentPoints.length;
            this.drawDebug();
        }
    }

    public insertScript(index: number, script: ScuffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        if (index === 0)
            this.script.translation.y += this.topOffset - script.bottomOffset;
        this.update();
    }

    public override update(element?: ScuffrElement) {
        this.dom.innerHTML = "";
        this.children.length = 0;
        this.attachmentPoints.length = 0;
        this.updateTransform();

        let x = 0;
        let y = 0;

        for (let blockIdx = 0; blockIdx < this.script.blocks.length; blockIdx++) {
            const block = this.script.blocks[blockIdx];
            const renderedBlock = block.render(null, new ScuffrBlockRef(blockIdx, this), this);
            this.children.push(renderedBlock);
            const dimensions = renderedBlock.dimensions;
            const height = dimensions.y;
            if (blockIdx === 0) {
                y += height / 2;
            } else {
                const yTrans = y + height / 2;
                renderedBlock.translation.y += yTrans;
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

        this.drawDebug();
    }

    public drawDebug() {
        for (const connection of this.attachmentPoints) {
            const pos = connection.translation;
            const point = this.dom.appendChild(document.createElementNS(SVG_NS, "circle"));
            point.setAttribute("r", "10");
            if (connection instanceof ScuffrScriptAttachmentPoint)
                point.setAttribute("style", "fill: #ff0000a0;");
            else
                point.setAttribute("style", "fill: #00ff00a0;");
            point.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
        }
    }

    public updateTransform() {
        this.translation.x = this.script.translation.x;
        this.translation.y = this.script.translation.y;
        this.dom.setAttribute("transform", `translate(${this.script.translation.x}, ${this.script.translation.y})`);
    }

    public onChildDrag?(key: number, event: MouseEvent): boolean {
        if (key === 0) {
            this.workspace.dragRenderedScript(this, event);
            return true;
        }

        const draggedChild = this.children[key];
        const pos = draggedChild.getAbsoluteTranslation();
        const newScriptBlocks = this.script.blocks.splice(key);
        this.update();
        const newScript = new BlockScript(newScriptBlocks, pos);
        const newRenderedScript = this.workspace.addScript(newScript);
        this.workspace.dragRenderedScript(newRenderedScript, event);

        return true;
    }

    public getBlock(key: number): ScuffrBlockInstanceElement | null {
        return this.children[key];
    }

    public getRoot(): ScuffrRootScriptElement {
        return this;
    }
}