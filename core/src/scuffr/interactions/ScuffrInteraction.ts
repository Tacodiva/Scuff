import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";

export abstract class ScuffrInteraction {
    public readonly root: ScuffrElementScriptContainer;

    public constructor(root: ScuffrElementScriptContainer) {
        this.root = root;
    }

    protected end() {
        this.root.workspace.endInteraction();
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
