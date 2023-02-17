import type { Vec2 } from "../../utils/Vec2";
import { ScuffrShapeInput } from "./ScuffrShapeInput";

export class ScuffrShapeInputSquare extends ScuffrShapeInput {

    constructor() {
        super({ x: 16, y: 32 });
    }

    protected _inputCreatePath(size: Vec2): string {
        return `M -10 ${-size.y / 2 + 4} a 4 4 0 0 1 4 -4 H ${size.x + 8} a 4 4 0 0 1 4 4 v ${size.y - 8} a 4 4 0 0 1 -4 4 H -6 a 4 4 0 0 1 -4 -4 V 0 z`;
    }

    public getPadding(contentSize: Vec2): Vec2 {
        return { x: 12, y: 4 };
    }
}