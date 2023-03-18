import type { ScuffrSvgBlockContent } from "../scuffr/ScuffrSvgBlockContent";
import type { ScuffrSvgBlockPart } from "../scuffr/ScuffrSvgBlockPart";

export interface BlockPart {
    render(block: ScuffrSvgBlockContent): ScuffrSvgBlockPart;
}