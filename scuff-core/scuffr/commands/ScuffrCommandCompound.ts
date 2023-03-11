import type { ScuffrCommand } from "./ScuffrCommand";

export class ScuffrCommandCompound implements ScuffrCommand {

    public readonly subCommands: ScuffrCommand[];

    public constructor(...subCommands: ScuffrCommand[]) {
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