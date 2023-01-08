import { ScuffrBackground, ScuffrBackgroundElement, ScuffrBackgroundShape } from "./ScuffrBackground";
import type { IScuffrBlockPartElement, ScuffrBlockContentElement } from "./ScuffrBlockInstanceElement";
import { ScuffrParentElement } from "./ScuffrElement";
import { ScuffrTextElement } from "./ScuffrTextElement";

export class ScuffrLiteralInputElement extends ScuffrParentElement implements IScuffrBlockPartElement {
    public override readonly children: readonly [ScuffrBackgroundElement, ScuffrTextElement];
    public override readonly parent: ScuffrBlockContentElement;

    public constructor(parent: ScuffrBlockContentElement, text: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [
            new ScuffrBackgroundElement(this, new ScuffrBackground(
                ScuffrBackgroundShape.ROUND_BLOCK,
                "var(--scuff-block-input-bg)",
                parent.parent.block.type.category.colorTertiary
            )),
            new ScuffrTextElement(this, text, "var(--scuff-block-input-font-fill)")
        ];
        this.children[0].updateDimensions(this.children[1]);
        this.dimensions = this.children[0].dimensions;
        this.topLeftOffset = this.children[0].topLeftOffset;
    }

    public getBackground(): ScuffrBackground {
        return this.children[0].background;
    }
}
