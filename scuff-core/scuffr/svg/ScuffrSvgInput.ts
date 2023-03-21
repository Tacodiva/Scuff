import type { BlockInput } from "../../block/BlockInput";
import type { IScuffrPointAttachable } from "../attachment-points/ScuffrAttachmentPoint";
import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrReferenceable } from "../ScuffrReference";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";

export interface ScuffrSvgInput extends IScuffrPointAttachable, ScuffrSvgBlockPart, ScuffrSvgElement, ScuffrReferenceable {
    asInput(): BlockInput;
    setParent(reference: ScuffrReferenceInput): void;
}