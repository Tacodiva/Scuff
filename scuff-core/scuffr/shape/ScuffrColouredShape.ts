import type { ScuffrShape } from "./ScuffrShape";

export interface ScuffrColouredShape {
    shape: ScuffrShape,
    typeClass: string | null,
    categoryClass: string | null
}