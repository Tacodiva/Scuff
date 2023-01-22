import { ScruffrElement, ScruffrParentElement } from "./ScruffrElement";
import type { IScruffrBlockPartElement } from "./ScruffrBlockInstanceElement";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInstance } from "../block/BlockInstance";
import { ScruffrAttachmentPointList } from "./ScruffrAttachmentPoint";
import type { ScruffrRootScriptElement } from "./ScruffrScriptElement";

export class ScruffrBackground {
    public readonly shape: ScruffrBackgroundShape;
    public readonly fill: string;
    public readonly stroke: string;

    public constructor(shape: ScruffrBackgroundShape, fill: string, stroke: string) {
        this.shape = shape;
        this.fill = fill;
        this.stroke = stroke;
    }
}

export interface IScruffrBackgroundModifier {
    getPath(size: Vec2, line: ScruffrBackgroundContentLine): string | null;
}

export interface ScruffrBackgroundContentLine {
    elements: readonly ScruffrElement[],
    dimensions: Vec2,
    modifier?: IScruffrBackgroundModifier
}

export abstract class ScruffrBackgroundElement<TContent extends ScruffrElement = ScruffrElement> extends ScruffrParentElement implements IScruffrBlockPartElement {
    public abstract override parent: ScruffrParentElement;
    public override children: readonly [TContent];
    public readonly background: ScruffrBackground;
    public readonly backgroundDOM: SVGElement;

    public get content() { return this.children[0]; }

    public constructor(parent: ScruffrParentElement, background: ScruffrBackground) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.backgroundDOM = this.dom.appendChild(background.shape.createElement())
        this.background = background;
        this.children = [this.createContent()];
    }

    protected abstract createContent(): TContent;

    public override update(propagateUp: boolean) {
        const lines = this.getBackgroundContentLines();
        let width = 0;
        let height = 0;

        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];

            let x = 0;
            let lineHeight = 0;
            for (let partIdx = 0; partIdx < line.elements.length; partIdx++) {
                const part = line.elements[partIdx];

                x = this.background.shape.prePartPadding(partIdx, x, part, line);
                part.translationParent.x = x;
                x = this.background.shape.postPartPadding(partIdx, x, part, line);

                if (part.dimensions.y > lineHeight) lineHeight = part.dimensions.y;
            }

            const minSize = this.background.shape.getMinLineSize(lineIdx, lines);
            if (x < minSize.x) x = minSize.x;
            if (lineHeight < minSize.y) lineHeight = minSize.y;
            line.dimensions.x = x;
            line.dimensions.y = lineHeight;
            if (x > width) width = x;
            height += lineHeight;
        }

        let y = -height / 2;
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            y += line.dimensions.y / 2;
            for (let partIdx = 0; partIdx < line.elements.length; partIdx++) {
                const part = line.elements[partIdx];
                part.translationParent.y = y;
                part.updateTraslation();
            }
            y += line.dimensions.y / 2;
        }

        this.content.dimensions = { x: width, y: height };
        this.content.topLeftOffset = { x: 0, y: height / 2 };

        const size = { x: width, y: height }

        const ajustX = size.x < this.background.shape.minSize.x;
        if (ajustX) size.x = this.background.shape.minSize.x;
        if (size.y < this.background.shape.minSize.y) {
            const dy = this.background.shape.minSize.y - size.y;
            size.y = this.background.shape.minSize.y;
            lines[0].dimensions.y += dy / 2;
            lines[lines.length - 1].dimensions.y += dy / 2;
        }

        this.background.shape.updateElement(this.backgroundDOM, size, lines, this.background);
        const padding = this.background.shape.getPadding(size);

        if (ajustX) {
            this.content.translationParent.x = (this.background.shape.minSize.x - this.content.dimensions.x) / 2;
        } else {
            this.content.translationParent.x = 0;
        }
        this.content.updateTraslation();

        this.translationSelf.x = padding.x;
        this.updateTraslation();

        this.dimensions = {
            x: size.x + padding.x * 2,
            y: size.y + padding.y * 2
        }

        this.topLeftOffset = this.background.shape.getTopLeftOffset(size);
        super.update(propagateUp);
    }

    protected getBackgroundContentLines(): ScruffrBackgroundContentLine[] {
        if (this.content instanceof ScruffrParentElement) return [{ elements: this.content.children, dimensions: { x: 0, y: 0 } }];
        else return [{ elements: [this.content], dimensions: { x: 0, y: 0 } }];
    }
}

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
