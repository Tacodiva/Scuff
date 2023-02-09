import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrShapeContentLine } from "./ScuffrShapeContentLine";
import { ScuffrShapeStackBody } from "./ScuffrShapeStackBody";

export class ScuffrShapeStackHead extends ScuffrShapeStackBody {
    public override createTopPath(size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number): string {
        return `m -8 ${-lines[0].dimensions.y / 2 - verticalPadding} c 2.6 -2.3 5.5 -4.3 8.5 -6.2 c -1 -12.5 5.3 -23.3 8.4 -24.8 c 3.7 -1.8 16.5 13.1 18.4 15.4 c 8.4 -1.3 17 -1.3 25.4 0 c 1.9 -2.3 14.7 -17.2 18.4 -15.4 c 3.1 1.5 9.4 12.3 8.4 24.8 c 3 1.8 5.9 3.9 8.5 6.1 H ${size.x + 4} a 4 4 0 0 1 4 4`;
    }

    public override createElement(): SVGElement {
        const root = document.createElementNS(SVG_NS, "g");
        root.appendChild(super.createElement());
        const owo = root.appendChild(document.createElementNS(SVG_NS, "path"));
        owo.setAttribute("d", "M 21.1 -27.3 a 3.4 3.4 0 1 1 -6.8 0 a 3.4 3.4 0 1 1 6.8 0 z M 51.2 -27.3 a 3.4 3.4 0 1 1 -6.8 0 a 3.4 3.4 0 1 1 6.8 0 z M 35.6 -24.1 c -0.9 0 -1.7 -0.3 -2.3 -0.9 c -0.6 0.6 -1.3 0.9 -2.2 0.9 c -0.9 0 -1.8 -0.3 -2.3 -0.9 c -1 -1.1 -1.1 -2.6 -1.1 -2.8 c 0 -0.5 0.5 -1 1 -1 l 0 0 c 0.6 0 1 0.5 1 1 c 0 0.4 0.1 1.7 1.4 1.7 c 0.5 0 0.7 -0.2 0.8 -0.3 c 0.3 -0.3 0.4 -1 0.4 -1.3 c 0 -0.1 0 -0.1 0 -0.2 c 0 -0.5 0.5 -1 1 -1 l 0 0 c 0.5 0 1 0.4 1 1 c 0 0 0 0.1 0 0.2 c 0 0.3 0.1 0.9 0.4 1.2 c 0.1 0.1 0.3 0.3 0.8 0.3 s 0.7 -0.2 0.8 -0.3 c 0.3 -0.4 0.4 -1.1 0.3 -1.3 c 0 -0.5 0.4 -1 0.9 -1.1 c 0.5 0 1 0.4 1.1 0.9 c 0 0.2 0.1 1.8 -0.8 2.8 c -0.3 0.6 -1 1.1 -2.2 1.1 z");
        owo.classList.add("scuff-bg-decor-dark");
        const ears = root.appendChild(document.createElementNS(SVG_NS, "path"));
        ears.setAttribute("d", " M 13.4 -39.6 c -1.7 -4.2 -4.5 -9.1 -5.8 -8.5 c -1.6 0.8 -5.4 7.9 -5 15.4 c 0 0.6 0.7 0.7 1.1 0.5 c 3 -1.6 6.4 -2.8 8.6 -3.6 c 1.5 -0.5 1.9 -1.9 1.1 -3.8 z M 65.1 -39.6 c 1.7 -4.2 4.5 -9.1 5.8 -8.5 c 1.6 0.8 5.4 7.9 5 15.4 c 0 0.6 -0.7 0.7 -1.1 0.5 c -3 -1.6 -6.4 -2.8 -8.6 -3.6 c -1.4 -0.5 -1.8 -1.9 -1.1 -3.8 z");
        ears.classList.add("scuff-bg-decor-light");
        return root;
    }

    public override updateElement(element: SVGElement, size: Vec2, lines: ScuffrShapeContentLine[], verticalPadding: number): void {
        super.updateElement(<SVGElement>element.children[0], size, lines, verticalPadding);
    }
}