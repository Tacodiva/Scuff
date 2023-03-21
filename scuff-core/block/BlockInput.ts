import type { ScuffrSvgInput } from "../scuffr/svg/ScuffrSvgInput";
import type { ScuffrReferenceBlock } from "../scuffr/ScuffrReferenceTypes";

export interface BlockInput {
    render(reference: ScuffrReferenceBlock): ScuffrSvgInput;
    clone() : BlockInput;
}
