import type { BlockInput } from "../block/BlockInput";
import type { IScuffrPointAttachable } from "./attachment-points/ScuffrAttachmentPoint";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrReferenceable } from "./ScuffrReference";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

export interface ScuffrElementInput extends IScuffrPointAttachable, ScuffrElementBlockPart, ScuffrElement, ScuffrReferenceable {
    asInput(): BlockInput;
    setParent(reference: ScuffrReferenceInput): void;
}