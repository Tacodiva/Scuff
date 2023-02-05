import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrBackgroundShape } from "./ScuffrBackgroundShape";
import type { ScuffrElement } from "../ScuffrElement";

export class ScuffrBackground {
    public readonly shape: ScuffrBackgroundShape;
    public readonly categoryClass: string | null;
    public readonly styleClass: string | null;

    public constructor(shape: ScuffrBackgroundShape, cssClass: string | null, styleClass: string | null) {
        this.shape = shape;
        this.categoryClass = cssClass;
        this.styleClass = styleClass;
    }
}

export interface IScuffrBackgroundModifier {
    getPath(size: Vec2, line: ScuffrBackgroundContentLine): string | null;
}

export interface ScuffrBackgroundContentLine {
    elements: readonly ScuffrElement[],
    dimensions: Vec2,
    modifier?: IScuffrBackgroundModifier
}
