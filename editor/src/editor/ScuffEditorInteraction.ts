import type { ScuffEditor } from "./ScuffEditor";

export class ScuffEditorInteraction {

    public readonly editor: ScuffEditor;

    public constructor(editor: ScuffEditor) {
        this.editor = editor;
    }

    public start() {
        this.editor.startInteraction(this);
    }

    public end() {
        this.editor.endInteraction();
    }

    public onEnd() { }

    public onStart() { }

    public onMouseWheel(event: MouseEvent) { }

    public onContextMenu(event: MouseEvent) { }

    public onMouseUp(event: MouseEvent) { }

    public onMouseDown(event: MouseEvent) { }

    public onKeyDown(event: KeyboardEvent) { }

    public onMouseMove(event: MouseEvent) { }
}