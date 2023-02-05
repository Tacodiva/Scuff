import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrBackground, ScuffrBackgroundContentLine } from "./ScuffrBackground";
import type { IScuffrBlockPartElement } from "../IScuffrBlockPartElement";

export abstract class ScuffrBackgroundShape {
    public readonly minSize: Vec2;

    public readonly snugglePadding: number;

    public constructor(minSize: Vec2, snugglePadding: number = 0) {
        this.minSize = minSize;
        this.snugglePadding = snugglePadding;
    }

    public abstract getPadding(contentSize: Vec2): Vec2;

    public getMinLineSize(lineIdx: number, lines: ScuffrBackgroundContentLine[]): Vec2 {
        return { x: 0, y: 0 };
    }

    public prePartPadding(partIdx: number, x: number, part: IScuffrBlockPartElement, line: ScuffrBackgroundContentLine): number {
        if (partIdx === 0) {
            if (part.getBackground && part.getBackground()?.shape === this) {
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
            }
        }
        return x;
    }

    public postPartPadding(partIdx: number, x: number, part: IScuffrBlockPartElement, line: ScuffrBackgroundContentLine): number {
        if (partIdx === line.elements.length - 1) {
            if (part.getBackground && part.getBackground()?.shape === this)
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
        } else x += 8;
        return x + part.dimensions.x;
    }

    public createElement(): SVGElement {
        const element = document.createElementNS(SVG_NS, "path");
        element.classList.add("scuff-block-bg-path");
        return element;
    }

    public updateElement(element: SVGElement, size: Vec2, lines: ScuffrBackgroundContentLine[], verticalPadding: number, background: ScuffrBackground) {
        element.setAttribute("d", this.createPath(size, lines, verticalPadding));
    }

    public abstract createPath(size: Vec2, lines: ScuffrBackgroundContentLine[], verticalPadding: number): string;
}
