import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrAttachmentPoint } from "../attachment-points/ScuffrAttachmentPoint";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import { ScuffrInteraction } from "./ScuffrInteraction";
import type { ScuffrCmdScriptSelect } from "../commands/ScuffrCmdScriptSelect";
import { ScuffrCmdCompound } from "../commands";

export class ScuffrInteractionDragScript extends ScuffrInteraction {
    public static readonly ATTACH_RADIUS = 60;

    public readonly script: ScuffrElementScriptRoot;
    public readonly scriptSelector: ScuffrCmdScriptSelect;
    public readonly offset: Vec2;
    public readonly startPos: Vec2;

    private _attachmentPoint: ScuffrAttachmentPoint | null;

    public constructor(scriptSelector: ScuffrCmdScriptSelect, startPos: Vec2) {
        super(scriptSelector.workspace);
        this.startPos = startPos;

        this.scriptSelector = scriptSelector;
        scriptSelector.do();
        this.script = this.workspace.getSelectedScript();

        const startPosWorkspace = this.workspace.toWorkspaceCoords(startPos);
        this.offset = {
            x: this.script.translationX - startPosWorkspace.x,
            y: this.script.translationY - startPosWorkspace.y,
        };
        this._attachmentPoint = null;
        this.script.dom.classList.add("scuff-block-dragging");
        // Move the script to the bottom of the container so it renders on top of everything else
        this.workspace.svgScriptContainer.appendChild(this.script.dom);
    }

    public override onMouseMove(event: MouseEvent): void {
        const scriptCoords = this.workspace.toWorkspaceCoords(event);
        scriptCoords.x += this.offset.x;
        scriptCoords.y += this.offset.y;

        this.script.translationSelf = scriptCoords;
        this.script.updateTranslation();

        let newPoint = this._findAttachmentPoint();

        if (this._attachmentPoint !== newPoint && (
            (!this._attachmentPoint || !newPoint) || (
                this._attachmentPoint.translation.x !== newPoint.translation.x ||
                this._attachmentPoint.translation.y !== newPoint.translation.y
            ))) {
            if (this._attachmentPoint)
                this._attachmentPoint.unhighlight(this.script);
            this._attachmentPoint = newPoint;
            if (this._attachmentPoint)
                this._attachmentPoint.highlight(this.script);
        }

        this.workspace.findWorkspaceCorners();
    }

    public override onEnd(): void {
        this.script.dom.classList.remove("scuff-block-dragging");
        if (this._attachmentPoint) {
            this._attachmentPoint.unhighlight(this.script);

            const takeCommand = this._attachmentPoint.takeScriptCommand(this.script);
            takeCommand.do();
            this.workspace.submitCommand(new ScuffrCmdCompound(this.scriptSelector, takeCommand), false);
        } else {
            this.scriptSelector.targetPosition = this.script.getAbsoluteTranslation();
            this.workspace.submitCommand(this.scriptSelector, false);
        }
    }

    private _findAttachmentPoint(): ScuffrAttachmentPoint | null {
        let closestDist = ScuffrInteractionDragScript.ATTACH_RADIUS * ScuffrInteractionDragScript.ATTACH_RADIUS;
        let closest = null;
        for (const pointList of this.workspace.attachmentPoints) {
            if (pointList.root === this.script)
                continue;
            for (const targetPoint of pointList.list) {
                const delta = targetPoint.calculateDelta(this.script);
                const dist = delta.x * delta.x + delta.y * delta.y;
                if (dist <= closestDist
                    && targetPoint.canTakeScript(this.script)) {
                    closestDist = dist;
                    closest = targetPoint;
                }
            }
        }
        return closest;
    }

    public override onMouseUp(event: MouseEvent): boolean {
        this.end();
        return true;
    }

    public override onMouseDown(event: MouseEvent): void { }
}
