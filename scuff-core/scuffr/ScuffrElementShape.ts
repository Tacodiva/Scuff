import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrElement } from "./ScuffrElement";
import { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrShapeContentLine } from "./shape/ScuffrShapeContentLine";
import type { ScuffrColouredShape } from "./shape/ScuffrColouredShape";

export abstract class ScuffrElementShape<TContent extends ScuffrElement = ScuffrElement> extends ScuffrElementParent implements ScuffrElementBlockPart {
    public abstract override parent: ScuffrElementParent;
    public override children: readonly [TContent];
    public readonly shape: ScuffrColouredShape;
    public readonly shapeDOM: SVGElement;

    public get content() { return this.children[0]; }

    public renderedLines: ScuffrShapeContentLine[] | null;

    public constructor(parent: ScuffrElementParent, shape: ScuffrColouredShape) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.dom.classList.add(...shape.categoryClass?.split(" ") ?? [], ...shape.typeClass?.split(" ") ?? []);
        this.shapeDOM = this.dom.appendChild(shape.shape.createElement())
        this.shape = shape;
        this.children = [this.createContent()];
        this.renderedLines = null;
    }

    protected abstract createContent(): TContent;

    public override update(propagateUp: boolean) {
        this.renderedLines = this.getContentLines();
        let width = 0;
        let height = 0;

        for (let lineIdx = 0; lineIdx < this.renderedLines.length; lineIdx++) {
            const line = this.renderedLines[lineIdx];

            let x = 0;
            let lineHeight = 0;
            for (let partIdx = 0; partIdx < line.elements.length; partIdx++) {
                const part = line.elements[partIdx];

                x = this.shape.shape.getPrePartPadding(partIdx, x, part, line);
                part.translationParent.x = x;
                x = this.shape.shape.getPostPartPadding(partIdx, x, part, line);

                if (part.dimensions.y > lineHeight) lineHeight = part.dimensions.y;
            }

            const minSize = this.shape.shape.getMinLineSize(lineIdx, this.renderedLines);
            if (x < minSize.x) x = minSize.x;
            if (lineHeight < minSize.y) lineHeight = minSize.y;
            line.dimensions.x = x;
            line.dimensions.y = lineHeight;
            if (x > width) width = x;
            height += lineHeight;
        }

        this.content.dimensions = { x: width, y: height };
        this.content.topLeftOffset = { x: 0, y: -this.renderedLines[0].dimensions.y / 2 };

        let y = this.content.topLeftOffset.y;
        for (let lineIdx = 0; lineIdx < this.renderedLines.length; lineIdx++) {
            const line = this.renderedLines[lineIdx];
            y += line.dimensions.y / 2;
            for (let partIdx = 0; partIdx < line.elements.length; partIdx++) {
                const part = line.elements[partIdx];
                part.translationParent.y = y;
                part.updateTraslation();
            }
            y += line.dimensions.y / 2;
        }

        const size = { x: width, y: height }

        const ajustX = size.x < this.shape.shape.minSize.x;
        if (ajustX) size.x = this.shape.shape.minSize.x;

        let verticalPadding = 0;
        if (size.y < this.shape.shape.minSize.y) {
            verticalPadding = (this.shape.shape.minSize.y - size.y) / 2;
            size.y = this.shape.shape.minSize.y;
        }

        this.shape.shape.updateElement(this.shapeDOM, size, this.renderedLines, verticalPadding);
        const padding = this.shape.shape.getPadding(size);

        if (ajustX) {
            this.content.translationParent.x = (this.shape.shape.minSize.x - this.content.dimensions.x) / 2;
        } else {
            this.content.translationParent.x = 0;
        }
        this.content.updateTraslation();

        this.translationSelf.x = padding.x;
        this.translationSelf.y = 0;
        this.updateTraslation();

        this.dimensions = {
            x: size.x + padding.x * 2,
            y: size.y + padding.y * 2
        }

        this.topLeftOffset = {
            x: padding.x,
            y: this.renderedLines[0].dimensions.y / 2 + verticalPadding
        };
        super.update(propagateUp);
    }

    public getContentLines(): ScuffrShapeContentLine[] {
        if (this.content instanceof ScuffrElementParent) return [{ elements: this.content.children, dimensions: { x: 0, y: 0 } }];
        else return [{ elements: [this.content], dimensions: { x: 0, y: 0 } }];
    }
}
