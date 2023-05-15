import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";

export class ScuffrCmdScriptSwapSelected {

    public readonly offset: number;
    public readonly root: ScuffrElementScriptContainer;

    public constructor(offset: number, root: ScuffrElementScriptContainer) {
        this.offset = offset;
        this.root = root;
    }

    public do(): void {
        this.root.swapSelected(this.root.children.length - this.offset - 1);
    }

    public undo(): void {
        this.do();
    }
}