import type { ScuffrEditorPalette } from "./ScuffrEditorPalette";
import { ScuffrSvgElementParent } from "./svg/ScuffrSvgElementParent";
import type { ScuffrSvgElement } from "./svg/ScuffrSvgElement";
import type { Vec2 } from "../utils/Vec2";

export class ScuffrEditorPalletteElementContainer extends ScuffrSvgElementParent {
    public children: ScuffrSvgElement[];
    public parent: ScuffrEditorPalette;

    protected readonly svgTranslation: SVGTransform;
    protected readonly svgScale: SVGTransform;

    public constructor(palette: ScuffrEditorPalette) {
        super(palette.dom.appendChild(document.createElementNS(SVG_NS, "g")), palette.workspace);
        this.parent = palette;
        this.children = [];

        this.svgScale = this.workspace.dom.createSVGTransform();
        this.dom.transform.baseVal.appendItem(this.svgScale);
        this.svgTranslation = this.workspace.dom.createSVGTransform();
        this.dom.transform.baseVal.appendItem(this.svgTranslation);
    }

    public updateContentTransformDOM() {
        const scale = this.parent.scriptContainer.contentScale;
        const translation = this.parent.scriptContainer.contentTranslation;
        this.svgScale.setScale(scale, scale);
        this.svgTranslation.setTranslate(translation.x, translation.y);
    }

    public appendElement<T extends ScuffrSvgElement>(element: T): T {
        this.children.push(element);
        return element;
    }
}