import type { MutVec2 } from "@scuff/core";
import type { ScuffrSvgBlockPart } from "../svg/ScuffrSvgBlockPart";
import type { ScuffrShapeModifier } from "./ScuffrShapeModifier";

export interface ScuffrShapeContentLine {
    elements: readonly ScuffrSvgBlockPart[],
    dimensions: MutVec2,
    modifier?: ScuffrShapeModifier
}
