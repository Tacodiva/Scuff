import type { ScuffrElementBlockContent } from "../scuffr/ScuffrElementBlockContent";
import type { ScuffrElementBlockPart } from "../scuffr/ScuffrElementBlockPart";

export interface BlockPart {
    render(block: ScuffrElementBlockContent): ScuffrElementBlockPart;
}