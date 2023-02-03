import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrBackgroundShape } from "./ScruffrBackgroundShape";
import type { ScruffrElement } from "../ScruffrElement";

export class ScruffrBackground {
    public readonly shape: ScruffrBackgroundShape;
    public readonly categoryClass: string | null;
    public readonly styleClass: string | null;

    public constructor(shape: ScruffrBackgroundShape, cssClass: string | null, styleClass: string | null) {
        this.shape = shape;
        this.categoryClass = cssClass;
        this.styleClass = styleClass;
    }
}

export interface IScruffrBackgroundModifier {
    getPath(size: Vec2, line: ScruffrBackgroundContentLine): string | null;
}

export interface ScruffrBackgroundContentLine {
    elements: readonly ScruffrElement[],
    dimensions: Vec2,
    modifier?: IScruffrBackgroundModifier
}
