import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementBlockPart } from "../ScuffrElementBlockPart";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";

export abstract class ScuffrShape {
    public readonly minSize: Vec2;

    public constructor(minSize: Vec2) {
        this.minSize = minSize;
    }

    public abstract getPadding(contentSize: Vec2): Vec2;

    public getMinLineSize(lineIdx: number, lines: ScuffrShapeContentLine[]): Vec2 {
        return { x: 0, y: 0 };
    }

    protected _getSnuggle(part: ScuffrElementBlockPart) {
        let partBg = part.getBackground && part.getBackground();
        if (partBg) {
            let snugglePadding = this._getSnugglePadding(partBg.shape);
            if (snugglePadding != null)
                return snugglePadding - this.getPadding(part.dimensions).x;
        }
        return 0;
    }

    protected _getSnugglePadding(shape: ScuffrShape): number | null {
        return null;
    }

    public getPrePartPadding(partIdx: number, x: number, part: ScuffrElementBlockPart, line: ScuffrShapeContentLine): number {
        if (partIdx === 0)
            x += this._getSnuggle(part);
        return x;
    }

    public getPostPartPadding(partIdx: number, x: number, part: ScuffrElementBlockPart, line: ScuffrShapeContentLine): number {
        if (partIdx === line.elements.length - 1) {
            x += this._getSnuggle(part);
        } else x += 8;
        return x + part.dimensions.x;
    }

    public createElement(): SVGElement {
        const element = document.createElementNS(SVG_NS, "path");
        element.classList.add("scuff-block-bg-path");
        return element;
    }

    public updateElement(element: SVGElement, size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number) {
        element.setAttribute("d", this.createPath(size, lines, verticalPadding));
    }

    public abstract createPath(size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number): string;
}
