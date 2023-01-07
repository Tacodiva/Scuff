import { ScuffrElement, ScuffrElementImpl, ScuffrParentElement } from "./ScuffrElement";

class ScuffrTextElement extends ScuffrElement {
    public parent: ScuffrParentElement;

    constructor(parent: ScuffrParentElement, text: string, fill?: string) {
        super(document.createElementNS(SVG_NS, "text"), { x: 0, y: 0 }, { x: 0, y: 0 }, parent.workspace);
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

        this.parent.dom.appendChild(this.dom);
    }
}

export { ScuffrTextElement }