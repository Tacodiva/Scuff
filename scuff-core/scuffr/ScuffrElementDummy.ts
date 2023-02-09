import type { Vec2 } from "../utils/Vec2";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";


export class ScuffrElementDummy extends ScuffrElement {
    public parent: ScuffrElementParent | null;

    public constructor(parent: ScuffrElementParent, dimensions: Vec2 = {x: 0, y: 0}) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace, { x: 0, y: 0 }, dimensions, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.parent = parent;
    }
}
