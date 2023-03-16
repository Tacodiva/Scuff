import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdCompound implements ScuffrCmd {

    public readonly subCommands: ScuffrCmd[];
    public readonly workspace: ScuffrWorkspace;

    public constructor(...subCommands: ScuffrCmd[]) {
        this.workspace = subCommands[0].workspace;
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