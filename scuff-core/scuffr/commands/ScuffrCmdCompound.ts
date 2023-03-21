import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdCompound implements ScuffrCmd {

    public readonly subCommands: ScuffrCmd[];
    public readonly root: ScuffrElementScriptContainer;

    public constructor(...subCommands: ScuffrCmd[]) {
        this.root = subCommands[0].root;
        this.subCommands = subCommands;
    }

    public do(): void {
        for (let i = 0; i < this.subCommands.length; i++) {
            this.subCommands[i].do();
        }
    }

    public undo(): void {
        for (let i = this.subCommands.length - 1; i >= 0; i--) {
            this.subCommands[i].undo();
        }
    }
}