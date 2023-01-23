import type { ScruffrBackground, ScruffrBackgroundContentLine } from ".";
import type { IScruffrBlockPartElement } from "../ScruffrBlockInstanceElement";
import { ScruffrParentElement, type ScruffrElement } from "../ScruffrElement";

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