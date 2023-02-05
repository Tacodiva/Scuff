import { ScruffrElement } from "./ScruffrElement";
import type { ScruffrParentElement } from "./ScruffrParentElement";


export class ScruffrDummyElement extends ScruffrElement {
    public parent: ScruffrParentElement | null;

    public constructor(parent: ScruffrParentElement) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.parent = parent;
    }
}
