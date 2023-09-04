import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrShape } from "./ScuffrShape";
import { ScuffrShapeInput } from "./ScuffrShapeInput";

export class ScuffrShapeInputTriangle extends ScuffrShapeInput {

    constructor() {
        super({ x: 16, y: 32 });
    }

    protected _inputCreatePath(size: Vec2): string {
        let radius = size.y / 2;
        return `m 0 ${-radius} h ${size.x} l ${radius} ${radius} l ${-radius} ${radius} H 0 l ${-radius} ${-radius} z`;
    }

    public getPadding(contentSize: Vec2): Vec2 {
        return { x: contentSize.y / 2, y: 4 };
    }

    public getTopLeftOffset(contentSize: Vec2): Vec2 {
        return { x: contentSize.y / 2 - 6, y: contentSize.y / 2 };
    }

    protected override _getSnugglePadding(shape: ScuffrShape): number | null {
        if (shape instanceof ScuffrShapeInputTriangle) return 8;
        return null;
    }
}