import type { IScruffrBlockPartElement } from "../ScruffrBlockInstanceElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrBackground, ScruffrBackgroundContentLine } from ".";

export abstract class ScruffrBackgroundShape {

    public static readonly ROUND_BLOCK = new class extends ScruffrBackgroundShape {
        public override createPath(size: Vec2, lines: ScruffrBackgroundContentLine[]): string {
            if (lines.length !== 1 || lines[0].modifier)
                throw new Error("Round shaped blocks do not support multiple lines.");
            let radius = size.y / 2;
            return `m ${size.x - 8} ${-radius} a ${radius} ${radius} 0 0 1 0 ${size.y} H 6 a ${radius} ${radius} 0 0 1 0 ${-size.y} z`;
        }

        public getPadding(contentSize: Vec2): Vec2 {
            return { x: contentSize.y / 2 - 6, y: 4 };
        }

        public getTopLeftOffset(contentSize: Vec2): Vec2 {
            return { x: contentSize.y / 2 - 6, y: contentSize.y / 2 };
        }
    }({ x: 20, y: 32 }, 4);

    public static readonly TRIANGLE_BLOCK = new class extends ScruffrBackgroundShape {
        public override createPath(size: Vec2, lines: ScruffrBackgroundContentLine[]): string {
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
    }({ x: 16, y: 32 }, 8);

    public static readonly STACK_BODY = new class extends ScruffrBackgroundShape {
        public override createPath(size: Vec2, lines: ScruffrBackgroundContentLine[]): string {
            let path = `m -8 ${-size.y / 2 + 4} a 4 4 0 0 1 4 -4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
            for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                const line = lines[lineIdx];
                let pathMod = null;
                if (line.modifier)
                    pathMod = line.modifier.getPath(size, line);
                if (pathMod) {
                    if (lineIdx === 0) size.y += 4;
                    if (lineIdx === lines.length - 1) size.y += 4;
                } else {
                    let height = line.dimensions.y;
                    if (lineIdx === 0) height -= 4;
                    if (lineIdx === lines.length - 1) height -= 4;
                    pathMod = `v ${height} `;
                }
                path += pathMod;
            }
            path += `a 4 4 0 0 1 -4 4 H 40 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 H -4 a 4 4 0 0 1 -4 -4 z`;
            return path;
        }

        public override prePartPadding(partIdx: number, x: number, part: IScruffrBlockPartElement, line: ScruffrBackgroundContentLine): number {
            x = super.prePartPadding(partIdx, x, part, line);
            if (x < 40 && (part.getBackground && part.getBackground()))
                x = 40;
            return x;
        }

        public getPadding(contentSize: Vec2): Vec2 {
            return { x: 8, y: 0 };
        }

        public getTopLeftOffset(contentSize: Vec2): Vec2 {
            return { x: 8, y: contentSize.y / 2 };
        }

        public override getMinLineSize(lineIdx: number, lines: ScruffrBackgroundContentLine[]): Vec2 {
            if (lineIdx === 0)
                return { x: 0, y: 44 };
            if (lineIdx === lines.length - 1)
                return { x: 0, y: 28 };
            return super.getMinLineSize(lineIdx, lines);
        }

    }({ x: 60, y: 48 });

    public readonly minSize: Vec2;

    public readonly snugglePadding: number;

    public constructor(minSize: Vec2, snugglePadding: number = 0) {
        this.minSize = minSize;
        this.snugglePadding = snugglePadding;
    }

    public abstract getTopLeftOffset(contentSize: Vec2): Vec2;
    public abstract getPadding(contentSize: Vec2): Vec2;

    public getMinLineSize(lineIdx: number, lines: ScruffrBackgroundContentLine[]): Vec2 {
        return { x: 0, y: 0 };
    }

    public prePartPadding(partIdx: number, x: number, part: IScruffrBlockPartElement, line: ScruffrBackgroundContentLine): number {
        if (partIdx === 0) {
            if (part.getBackground && part.getBackground()?.shape === this) {
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
            }
        }
        return x;
    }

    public postPartPadding(partIdx: number, x: number, part: IScruffrBlockPartElement, line: ScruffrBackgroundContentLine): number {
        if (partIdx === line.elements.length - 1) {
            if (part.getBackground && part.getBackground()?.shape === this)
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
        } else x += 8;
        return x + part.dimensions.x;
    }

    public createElement(): SVGElement {
        return document.createElementNS(SVG_NS, "path");
    }

    public updateElement(element: SVGElement, size: Vec2, lines: ScruffrBackgroundContentLine[], background: ScruffrBackground) {
        element.style.fill = background.fill;
        element.style.stroke = background.stroke;
        element.setAttribute("d", this.createPath(size, lines));
    }

    public abstract createPath(size: Vec2, lines: ScruffrBackgroundContentLine[]): string;
}
