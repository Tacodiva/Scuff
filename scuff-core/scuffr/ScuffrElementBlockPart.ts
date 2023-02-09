import type { ScuffrShapeModifier } from "./shape/ScuffrShapeModifier";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrColouredShape } from "./shape";

export interface ScuffrElementBlockPart extends ScuffrElement {
    getBackground?(): ScuffrColouredShape | null;
    getBackgroundModifier?(): ScuffrShapeModifier | null;
    onAncestryChange?(root: ScuffrElementScriptRoot | null): void;
}
