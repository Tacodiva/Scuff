import type { ScuffrShapeModifier } from "../shape/ScuffrShapeModifier";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "../shape";

export interface ScuffrSvgBlockPart extends ScuffrSvgElement {
    getBackground?(): ScuffrColouredShape | null;
    getBackgroundModifier?(): ScuffrShapeModifier | null;
    onAncestryChange?(root: ScuffrSvgScriptRoot | null): void;
}
