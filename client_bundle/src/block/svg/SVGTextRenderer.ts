import { ScuffrElement, ScuffrElementImpl, ScuffrParentElement } from "./ScuffrElement";

class ScuffrTextElement extends ScuffrElement {
    public parent: ScuffrParentElement;

    constructor(parent: ScuffrParentElement, text: string, fill?: string) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "text")), { x: 0, y: 0 }, { x: 0, y: 0 }, parent.workspace);
        this.parent = parent;
        this.dom.setAttribute("dominant-baseline", "middle");
        this.dom.setAttribute("dy", '1');
        this.dom.classList.add("scuff-block-text");
        if (fill)
            this.dom.setAttribute("style", `fill: ${fill};`);
        this.dom.appendChild(document.createTextNode(text));
        const bounds = this.dom.getBoundingClientRect();
        this.dimensions = { x: bounds.width / this.workspace.scale, y: bounds.height / this.workspace.scale };
    }
}

export { ScuffrTextElement }