import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElement } from "../ScuffrElement";
import type { ScuffrShapeModifier } from "./ScuffrShapeModifier";

export interface ScuffrShapeContentLine {
    elements: readonly ScuffrElement[],
    dimensions: Vec2,
    modifier?: ScuffrShapeModifier
}
