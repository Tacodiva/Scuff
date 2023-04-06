import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementParent } from "../ScuffrElementParent";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";

export class ScuffrSvgText extends ScuffrSvgElement {
    public readonly parent: ScuffrElementParent;

    public text: string;
    public padding: Vec2 | null;
    private _textNode: Text | null;

    public constructor(parent: ScuffrElementParent, text: string, padding?: Vec2, ...classes: string[]) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "text")), parent.workspace);
        this.parent = parent;
        this.text = text;
        this.dom.setAttribute("dominant-baseline", "middle");
        this.dom.setAttribute("dy", '1');
        this.dom.classList.add("scuff-block-text", ...classes);
        this.padding = padding ?? null;
        this._textNode = null;
    }

    public setText(text: string) {
        this.text = text;
        this.update(true);
    }

    public override update(propagateUp: boolean): void {
        if (this._textNode) this._textNode.nodeValue = this.text;
        else this._textNode = document.createTextNode(this.text);
        this.dimensions = this.workspace.getTextDimensions(this.text, this._textNode);
        if (this.padding) {
            this.dimensions.x += this.padding.x;
            this.dimensions.y += this.padding.y;
            this.dom.setAttribute("x", ""+this.padding.x);
            this.dom.setAttribute("y", ""+this.padding.y);
        }
        this.topLeftOffset = { x: 0, y: this.dimensions.x / 2 };
        this.dom.appendChild(this._textNode);
        super.update(propagateUp);
    }
}