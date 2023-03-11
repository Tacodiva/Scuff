import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { ScuffrReferenceBlock } from "../scuffr/ScuffrReferenceTypes";

export interface BlockInput {
    render(reference: ScuffrReferenceBlock): ScuffrElementInput;
    clone() : BlockInput;
}
