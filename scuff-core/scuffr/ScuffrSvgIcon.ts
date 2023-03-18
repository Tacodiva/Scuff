import { ScuffrSvg, ScuffrSvgParent } from ".";
import type { Vec2 } from "../utils/Vec2";

export class ScuffrSvgIcon extends ScuffrSvg {

    public parent: ScuffrSvgParent;

    public constructor(parent: ScuffrSvgParent, id: string, dimensions: Vec2, padding: Vec2 = { x: 0, y: 0 }) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "use")), parent.workspace,
            { x: padding.x, y: -dimensions.y / 2 },
            { x: dimensions.x + padding.x * 2, y: dimensions.y + padding.y * 2 });
        this.parent = parent;
        this.dom.setAttribute("href", "#" + id);
        this.dom.setAttribute("width", "" + dimensions.x);
        this.dom.setAttribute("height", "" + dimensions.y);
    }

}