import type { ScuffrSvgBlockContent } from "../scuffr/svg/ScuffrSvgBlockContent";
import type { ScuffrSvgBlockPart } from "../scuffr/svg/ScuffrSvgBlockPart";

export interface BlockPart {
    render(block: ScuffrSvgBlockContent): ScuffrSvgBlockPart;
}