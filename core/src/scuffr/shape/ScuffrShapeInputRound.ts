import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrShape } from "./ScuffrShape";
import { ScuffrShapeInput } from "./ScuffrShapeInput";

export class ScuffrShapeInputRound extends ScuffrShapeInput {

    constructor(minHeight: number) {
        super({ x: 20, y: minHeight });
    }

    protected _inputCreatePath(size: Vec2): string {
        let radius = size.y / 2;
        return `m ${size.x - 8} ${-radius} a ${radius} ${radius} 0 0 1 0 ${size.y} H 6 a ${radius} ${radius} 0 0 1 0 ${-size.y} z`;
    }

    public getPadding(contentSize: Vec2): Vec2 {
        return { x: contentSize.y / 2 - 6, y: 4 };
    }

    protected override _getSnugglePadding(shape: ScuffrShape): number | null {
        if (shape instanceof ScuffrShapeInputRound) return 4;
        return null;
    }
}