import type { Vec2 } from "@scuff/core";
import type { ScuffrCmd } from "./ScuffrCmd";

export interface ScuffrCmdScriptSelect extends ScuffrCmd {
    targetPosition: Vec2;
}