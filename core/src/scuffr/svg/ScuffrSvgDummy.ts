import type { Vec2 } from "../../utils/Vec2";
import { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";

export class ScuffrSvgDummy extends ScuffrSvgElement {
    public parent: ScuffrSvgElementParent | null;

    public constructor(parent: ScuffrSvgElementParent, dimensions: Vec2 = {x: 0, y: 0}) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace, { x: 0, y: 0 }, dimensions, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.parent = parent;
    }
}
