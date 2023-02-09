import type { Vec2 } from "../../utils/Vec2";
import { ScuffrShape } from "./ScuffrShape";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";
import { ScuffrShapeInputTriangle } from "./ScuffrShapeInputTriangle";

export class ScuffrShapeInputRound extends ScuffrShape {

    constructor() {
        super({ x: 20, y: 32 });
    }

    public override createPath(size: Vec2, lines: ScuffrShapeContentLine[]): string {
        if (lines.length !== 1 || lines[0].modifier)
            throw new Error("Round shaped blocks do not support multiple lines.");
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