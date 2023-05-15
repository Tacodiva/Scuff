import type { ScuffrShape } from "./ScuffrShape";

export interface ScuffrColouredShape {
    shape: ScuffrShape,
    typeClasses: string[],
    categoryClasses: string[]
}