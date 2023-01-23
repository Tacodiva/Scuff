import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrBackgroundShape } from "./ScruffrBackgroundShape";
import type { ScruffrElement } from "../ScruffrElement";

export class ScruffrBackground {
    public readonly shape: ScruffrBackgroundShape;
    public readonly fill: string;
    public readonly stroke: string;

    public constructor(shape: ScruffrBackgroundShape, fill: string, stroke: string) {
        this.shape = shape;
        this.fill = fill;
        this.stroke = stroke;
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
