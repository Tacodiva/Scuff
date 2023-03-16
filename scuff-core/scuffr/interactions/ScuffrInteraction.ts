import type { ScuffrWorkspace } from "../ScuffrWorkspace";

export abstract class ScuffrInteraction {
    public readonly workspace: ScuffrWorkspace;

    public constructor(workspace: ScuffrWorkspace) {
        this.workspace = workspace;
    }

    protected end() {
        this.workspace.endInteraction();
    }

    public onEnd() { }

    public onMouseDown(event: MouseEvent): boolean | void {
        event.preventDefault();
    }

    public onMouseUp(event: MouseEvent): boolean | void {
        this.end();
    }

    public onMouseWheel(event: MouseEvent): void {
        this.end();
    }

    public onKeyDown(event: KeyboardEvent): void { }

    public onMouseMove(event: MouseEvent): void {
        if ((event.buttons & 1) !== 0)
            this.end();
    }
}
