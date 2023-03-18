import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrSvgElement } from "../ScuffrSvgElement";
import type { ScuffrShapeModifier } from "./ScuffrShapeModifier";

export interface ScuffrShapeContentLine {
    elements: readonly ScuffrSvgElement[],
    dimensions: Vec2,
    modifier?: ScuffrShapeModifier
}
