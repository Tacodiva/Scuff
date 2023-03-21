import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";

export interface ScuffrCmd {
    readonly root: ScuffrElementScriptContainer;
    do() : void;
    undo() : void;
}