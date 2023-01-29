import type { IScruffrBlockPartElement } from "../ScruffrBlockInstanceElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrBackground, ScruffrBackgroundContentLine } from ".";

export abstract class ScruffrBackgroundShape {
    public readonly minSize: Vec2;

    public readonly snugglePadding: number;

    public constructor(minSize: Vec2, snugglePadding: number = 0) {
        this.minSize = minSize;
        this.snugglePadding = snugglePadding;
    }

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

    public updateElement(element: SVGElement, size: Vec2, lines: ScruffrBackgroundContentLine[], verticalPadding: number, background: ScruffrBackground) {
        element.style.fill = background.fill;
        element.style.stroke = background.stroke;
        element.setAttribute("d", this.createPath(size, lines, verticalPadding));
    }

    public abstract createPath(size: Vec2, lines: ScruffrBackgroundContentLine[], verticalPadding: number): string;
}
