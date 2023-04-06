import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrCmd } from "./ScuffrCmd";

export interface ScuffrCmdScriptSelect extends ScuffrCmd {
    targetPosition: Vec2;
}