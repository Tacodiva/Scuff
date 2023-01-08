import { ScuffrElement, ScuffrElementImpl, ScuffrParentElement } from "./ScuffrElement";

class ScuffrTextElement extends ScuffrElement {
    public parent: ScuffrParentElement;

    constructor(parent: ScuffrParentElement, text: string, fill?: string) {
        super(document.createElementNS(SVG_NS, "text"), parent.workspace);
        this.parent = parent;
        this.dom.setAttribute("dominant-baseline", "middle");
        this.dom.setAttribute("dy", '1');
        this.dom.classList.add("scuff-block-text");
        if (fill)
            this.dom.setAttribute("style", `fill: ${fill};`);
        this.dom.appendChild(document.createTextNode(text));

        parent.workspace.textStagingElement.appendChild(this.dom);

        const bounds = this.dom.getBoundingClientRect();
        this.dimensions = { x: bounds.width, y: bounds.height };
        this.topLeftOffset = { x: 0, y: bounds.width / 2 };

        this.parent.dom.appendChild(this.dom);
    }
}

export { ScuffrTextElement }