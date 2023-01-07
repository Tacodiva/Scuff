import { ScuffrBlockInstanceElement, ScuffrParentRef, SVGBlockRenderContext, type IScuffrBlockParent } from "./SVGBlockRenderer";
import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { BlockScript } from "../BlockScript";
import type { Vec2 } from "../../utils/Vec2";
import type { SVGRenderedWorkspace } from "./SVGWorkspace";
import type { BlockAttachmentPoint } from "../BlockAttachmentPoint";

class SVGRenderedScript extends ScuffrParentElement implements IScuffrBlockParent<number> {

    public readonly children: ScuffrBlockInstanceElement[];
    public readonly parent: SVGRenderedWorkspace;

    public readonly script: BlockScript;
    public readonly attachmentPoints: BlockAttachmentPoint[];

    public constructor(workspace: SVGRenderedWorkspace, script: BlockScript) {
        super(workspace.scriptContainer.appendChild(document.createElementNS(SVG_NS, "g")), { x: 0, y: 0 }, { x: 0, y: 0 }, workspace);
        this.parent = workspace;
        this.children = [];
        this.script = script;
        this.attachmentPoints = [];
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
            const context = new SVGBlockRenderContext(this.workspace, this.attachmentPoints);
            const renderedBlock = block.render(null, new ScuffrParentRef(blockIdx, this), context);
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

            //     if (blockIdx === 0) {
            //         if (block.type.canStackUp(block))
            //             this.attachPoints.push({ translation: { x: this.script.translation.x, y: this.script.translation.y }, type: new BlockStackAttachmentPointType(false, true) });
            //     }
            //     if (block.type.canStackDown(block))
            //         if (blockIdx === this.script.blocks.length - 1)
            //             this.attachPoints.push({ translation: { x: this.script.translation.x, y: y + this.script.translation.y }, type: new BlockStackAttachmentPointType(true, false) });
            //         else
            //             this.attachPoints.push({ translation: { x: this.script.translation.x, y: y + this.script.translation.y }, type: new BlockStackAttachmentPointType(true, true) });
        }

        this.dimensions = { x, y };
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
        const newScriptBlocks = this.script.blocks.splice(key, this.script.blocks.length - key);
        this.update();
        const newScript = new BlockScript(newScriptBlocks, pos);
        const newRenderedScript = this.workspace.addScript(newScript);
        this.workspace.dragRenderedScript(newRenderedScript, event);
        
        return true;
    }

    public get(key: number): ScuffrBlockInstanceElement | null {
        return this.children[key];
    }
}

function renderScript(workspace: SVGRenderedWorkspace, script: BlockScript): SVGRenderedScript {
    const element = new SVGRenderedScript(workspace, script);
    element.update();
    return element;
}

export { renderScript, SVGRenderedScript }