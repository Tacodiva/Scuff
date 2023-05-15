import type { ScuffrShapeModifier } from "../shape/ScuffrShapeModifier";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "../shape";
import type { ScuffrReferenceable } from "../ScuffrReference";
import type { ScuffrPointAttachable } from "../attachment-points/ScuffrAttachmentPoint";

export interface ScuffrSvgBlockPart extends ScuffrSvgElement, ScuffrReferenceable, ScuffrPointAttachable {
    getBackground?(): ScuffrColouredShape | null;
    getBackgroundModifier?(): ScuffrShapeModifier | null;
    onAncestryChange?(root: ScuffrSvgScriptRoot | null): void;
}
