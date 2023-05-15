import type { Vec2 } from "@scuff/core";
import { ScuffEditorInteraction } from "../../editor/ScuffEditorInteraction";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";

export class ScuffrInteractionPanning extends ScuffEditorInteraction {
    public readonly startTransform: Vec2;
    public readonly startPos: Vec2;
    public readonly root: ScuffrElementScriptContainer;

    constructor(root: ScuffrElementScriptContainer, startPos: Vec2) {
        super(root.workspace.editor);
        this.root = root;
        this.startPos = startPos;
        this.startTransform = root.contentTranslation;
    }

    public override onMouseMove(event: MouseEvent): void {
        this.root.contentTranslation = {
            x: this.startTransform.x +
                (event.x - this.startPos.x) / this.root.contentScale,
            y: this.startTransform.y +
                (event.y - this.startPos.y) / this.root.contentScale,
        };
        this.root.updateContentTransform();
    }

    public override onMouseUp(event: MouseEvent): void {
        this.end();
    }

    public override onMouseWheel(event: MouseEvent): void {
        this.end();
    }

    public override onMouseDown(event: MouseEvent): void {
        event.preventDefault();
    }
}
