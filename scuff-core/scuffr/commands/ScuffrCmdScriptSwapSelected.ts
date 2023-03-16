import type { ScuffrWorkspace } from "../ScuffrWorkspace";

export class ScuffrCmdScriptSwapSelected {

    public readonly offset: number;
    public readonly workspace: ScuffrWorkspace;

    public constructor(offset: number, workspace: ScuffrWorkspace) {
        this.offset = offset;
        this.workspace = workspace;
    }

    public do(): void {
        this.workspace.swapSelected(this.workspace.children.length - this.offset - 1);
    }

    public undo(): void {
        this.do();
    }
}