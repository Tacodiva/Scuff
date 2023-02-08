import type { ScuffrBackground, ScuffrBackgroundContentLine } from "./ScuffrBackground";
import type { IScuffrBlockPartElement } from "../IScuffrBlockPartElement";
import type { ScuffrElement } from "../ScuffrElement";
import { ScuffrParentElement } from "../ScuffrParentElement";

export abstract class ScuffrBackgroundElement<TContent extends ScuffrElement = ScuffrElement> extends ScuffrParentElement implements IScuffrBlockPartElement {
    public abstract override parent: ScuffrParentElement;
    public override children: readonly [TContent];
    public readonly background: ScuffrBackground;
    public readonly backgroundDOM: SVGElement;

    public get content() { return this.children[0]; }
    
    public renderedLines : ScuffrBackgroundContentLine[] | null;

    public constructor(parent: ScuffrParentElement, background: ScuffrBackground) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.dom.classList.add(...background.categoryClass?.split(" ") ?? [], ...background.styleClass?.split(" ") ?? []);
        this.backgroundDOM = this.dom.appendChild(background.shape.createElement())
        this.background = background;
        this.children = [this.createContent()];
        this.renderedLines = null;
    }

    protected abstract createContent(): TContent;

    public override update(propagateUp: boolean) {
        this.renderedLines = this.getBackgroundContentLines();
        let width = 0;
        let height = 0;

        for (let lineIdx = 0; lineIdx < this.renderedLines.length; lineIdx++) {
            const line = this.renderedLines[lineIdx];

            let x = 0;
            let lineHeight = 0;
            for (let partIdx = 0; partIdx < line.elements.length; partIdx++) {
                const part = line.elements[partIdx];

                x = this.background.shape.prePartPadding(partIdx, x, part, line);
                part.translationParent.x = x;
                x = this.background.shape.postPartPadding(partIdx, x, part, line);

                if (part.dimensions.y > lineHeight) lineHeight = part.dimensions.y;
            }

            const minSize = this.background.shape.getMinLineSize(lineIdx, this.renderedLines);
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

        const ajustX = size.x < this.background.shape.minSize.x;
        if (ajustX) size.x = this.background.shape.minSize.x;

        let verticalPadding = 0;
        if (size.y < this.background.shape.minSize.y) {
            verticalPadding = (this.background.shape.minSize.y - size.y) / 2;
            size.y = this.background.shape.minSize.y;
        }

        this.background.shape.updateElement(this.backgroundDOM, size, this.renderedLines, verticalPadding, this.background);
        const padding = this.background.shape.getPadding(size);

        if (ajustX) {
            this.content.translationParent.x = (this.background.shape.minSize.x - this.content.dimensions.x) / 2;
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
        // console.log(this.renderedLines[0].dimensions.y + ", " + verticalPadding);

        this.topLeftOffset = {
            x: padding.x,
            y: this.renderedLines[0].dimensions.y / 2 + verticalPadding
        };
        super.update(propagateUp);
    }

    public getBackgroundContentLines(): ScuffrBackgroundContentLine[] {
        if (this.content instanceof ScuffrParentElement) return [{ elements: this.content.children, dimensions: { x: 0, y: 0 } }];
        else return [{ elements: [this.content], dimensions: { x: 0, y: 0 } }];
    }
}
