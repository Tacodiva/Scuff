import type { ScuffrAttachmentPoint } from "../attachment-points/ScuffrAttachmentPoint";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrCmdScriptSelect } from "../commands/ScuffrCmdScriptSelect";
import { ScuffrCmdCompound } from "../commands";
import { ScuffEditorInteraction } from "../../editor/ScuffEditorInteraction";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { Vec2 } from "@scuff/core";

export class ScuffrInteractionDragScript extends ScuffEditorInteraction {
    public static readonly ATTACH_RADIUS = 60;

    public readonly root: ScuffrElementScriptContainer;
    public readonly script: ScuffrSvgScriptRoot;
    public readonly scriptSelector: ScuffrCmdScriptSelect;
    public readonly offset: Vec2;
    public readonly startPos: Vec2;

    private _attachmentPoint: ScuffrAttachmentPoint | null;

    public constructor(scriptSelector: ScuffrCmdScriptSelect, event: MouseEvent) {
        super(scriptSelector.root.workspace.editor);
        this.root = scriptSelector.root;
        this.startPos = event;

        this.scriptSelector = scriptSelector;
        scriptSelector.do();
        this.script = this.root.getSelectedScript();

        const startPosWorkspace = this.root.toWorkspaceCoords(event);
        this.offset = {
            x: this.script.translationX - startPosWorkspace.x,
            y: this.script.translationY - startPosWorkspace.y,
        };
        this._attachmentPoint = null;
        this.script.dom.classList.add("scuff-block-dragging");
        // Move the script to the bottom of the container so it renders on top of everything else
        // TODO Make selected script always on top.
        // this.root.svgScriptContainer.appendChild(this.script.dom);
    }

    public override onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        const scriptCoords = this.root.toWorkspaceCoords(event);
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

        this.root.updateScrollPane();
    }

    public override onEnd(): void {
        this.script.dom.classList.remove("scuff-block-dragging");
        if (this._attachmentPoint) {
            this._attachmentPoint.unhighlight(this.script);

            const takeCommand = this._attachmentPoint.takeScriptCommand(this.script);
            takeCommand.do();
            this.root.workspace.submitCommand(new ScuffrCmdCompound(this.scriptSelector, takeCommand), false);
        } else {
            this.scriptSelector.targetPosition = this.script.getAbsoluteTranslation();
            this.root.workspace.submitCommand(this.scriptSelector, false);
        }
    }

    private _findAttachmentPoint(): ScuffrAttachmentPoint | null {
        let closestDist = ScuffrInteractionDragScript.ATTACH_RADIUS * ScuffrInteractionDragScript.ATTACH_RADIUS;
        let closest = null;
        for (const pointList of this.root.getAttachmentPoints()) {
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

    public override onMouseDown(event: MouseEvent) {
        event.preventDefault();
    }

    public override onMouseUp(event: MouseEvent) {
        this.end();
        event.stopPropagation();
    }

    public override onMouseWheel(event: MouseEvent) {
        this.end();
    }
}
