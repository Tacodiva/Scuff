import type { ScuffrWorkspace } from "..";

export interface ScuffrCmd {
    readonly workspace: ScuffrWorkspace;
    do() : void;
    undo() : void;
}