import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrSvgBlockPart } from "../svg/ScuffrSvgBlockPart";
import { ScuffrShape } from "./ScuffrShape";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";
import type { ScuffrStackNub } from "./ScuffrStackNub";
import { ScuffrStackNubSimple } from "./ScuffrStackNubSimple";

export class ScuffrShapeStackBody extends ScuffrShape {
    public readonly nub : ScuffrStackNub;

    public constructor(nub? : ScuffrStackNub) {
        super({ x: 60, y: 48 });
        this.nub = nub ?? ScuffrStackNubSimple.defaultNub;
    }

    public getPadding(contentSize: Vec2): Vec2 {
        return { x: 8, y: 0 };
    }

    public override createPath(size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number): string {
        let path = this.createTopPath(size, lines, verticalPadding);
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            let pathMod = null;
            if (line.modifier)
                pathMod = line.modifier.getPath(size, this, line);
            if (!pathMod) {
                let height = line.dimensions.y;
                if (lineIdx === 0) height += verticalPadding - 4;
                if (lineIdx === lines.length - 1) height += verticalPadding - 4;
                pathMod = `v ${height} `;
            }
            path += pathMod;
        }
        path += this.createBottomPath();
        return path;
    }

    public createTopPath(size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number): string {
        return `m -8 ${-lines[0].dimensions.y / 2 - verticalPadding + 4} a 4 4 0 0 1 4 -4 ${this.nub.getRightPath()} H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }

    public createBottomPath(): string {
        return `a 4 4 0 0 1 -4 4 ${this.nub.getLeftPath(-4)} a 4 4 0 0 1 -4 -4 z`;
    }

    public override getPrePartPadding(partIdx: number, x: number, part: ScuffrSvgBlockPart, line: ScuffrShapeContentLine): number {
        x = super.getPrePartPadding(partIdx, x, part, line);
        if (x < 40 && (part.getBackground && part.getBackground()))
            x = 40;
        return x;
    }

    public override getMinLineSize(lineIdx: number, lines: ScuffrShapeContentLine[]): Vec2 {
        if (lineIdx === 0)
            return { x: 0, y: 44 };
        if (lineIdx === lines.length - 1)
            return { x: 0, y: 28 };
        return super.getMinLineSize(lineIdx, lines);
    }
}
