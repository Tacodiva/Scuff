import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";

export interface ScuffrSvgShapeContent extends ScuffrSvgElement {
    children?: readonly ScuffrSvgBlockPart[];
}
