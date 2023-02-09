import type { Vec2 } from "../../utils/Vec2";
import { ScuffrShape } from "./ScuffrShape";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";
import { ScuffrShapeInputRound } from "./ScuffrShapeInputRound";

export class ScuffrShapeInputTriangle extends ScuffrShape {

    constructor() {
        super({ x: 16, y: 32 });
    }

    public override createPath(size: Vec2, lines: ScuffrShapeContentLine[]): string {
        if (lines.length !== 1 || lines[0].modifier)
            throw new Error("Round shaped blocks do not support multiple lines.");
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