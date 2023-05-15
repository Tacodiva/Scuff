import { ScuffEditorInteraction } from "./ScuffEditorInteraction";

export class ScuffEditorInteractionDrag extends ScuffEditorInteraction {

    public override onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.end();
    }

    public override onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }
}