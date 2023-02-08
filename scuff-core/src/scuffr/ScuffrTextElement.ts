import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrParentElement } from "./ScuffrParentElement";

export class ScuffrTextElement extends ScuffrElement {
    public readonly parent: ScuffrParentElement;

    public text: string;
    private _textNode: Text | null;

    public constructor(parent: ScuffrParentElement, text: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "text")), parent.workspace);
        this.parent = parent;
        this.text = text;
        this.dom.setAttribute("dominant-baseline", "middle");
        this.dom.setAttribute("dy", '1');
        this.dom.classList.add("scuffr-block-text");
        this._textNode = null;
    }

    public override update(propagateUp: boolean): void {
        if (this._textNode) this._textNode.nodeValue = this.text;
        else this._textNode = document.createTextNode(this.text);
        this.dimensions = this.workspace.getTextNodeDimensions(this._textNode);
        this.topLeftOffset = { x: 0, y: this.dimensions.x / 2 };
        this.dom.appendChild(this._textNode);
        super.update(propagateUp);
    }
}