import type { ScuffrShapeModifier } from "../shape/ScuffrShapeModifier";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "../shape";
import type { ScuffrReferenceable } from "../ScuffrReference";
import type { ScuffrAttachmentPoint, ScuffrPointAttachable } from "../attachment-points/ScuffrAttachmentPoint";
import type { ScuffrReferenceBlock, ScuffrReferenceInput } from "../ScuffrReferenceTypes";

export type ScuffrSvgBlockPartCloneFactory = (reference: ScuffrReferenceInput) => ScuffrSvgBlockPart;

export interface ScuffrSvgBlockPart extends ScuffrSvgElement, ScuffrReferenceable, ScuffrPointAttachable {
    getBackground?(): ScuffrColouredShape | null;
    getBackgroundModifier?(): ScuffrShapeModifier | null;
    onAncestryChange?(root: ScuffrSvgScriptRoot | null): void;
    addAttachmentPoint?(point: ScuffrAttachmentPoint): void;
    setParent?(reference: ScuffrReferenceInput): void;
    createCloneFactory(): ScuffrSvgBlockPartCloneFactory;
}