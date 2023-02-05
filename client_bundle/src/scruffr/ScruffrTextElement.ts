import { ScruffrElement } from "./ScruffrElement";
import type { ScruffrParentElement } from "./ScruffrParentElement";

export class ScruffrTextElement extends ScruffrElement {
    public readonly parent: ScruffrParentElement;

    public text: string;
    private _textNode: Text | null;

    public constructor(parent: ScruffrParentElement, text: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "text")), parent.workspace);
        this.parent = parent;
        this.text = text;
        this.dom.setAttribute("dominant-baseline", "middle");
        this.dom.setAttribute("dy", '1');
        this.dom.classList.add("scruffr-block-text");
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