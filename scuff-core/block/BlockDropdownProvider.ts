import type { ScuffrElementBlockContent, ScuffrElementBlockInstance, ScuffrElementInput } from "../scuffr";
import type { ScuffrBlockReference, ScuffrBlockReferenceParent } from "../scuffr/ScuffrBlockReference";
import type { BlockDropdownOption } from "./BlockDropdownOption";
import type { BlockInput } from "./BlockInput";
import type { BlockInstance } from "./BlockInstance";
import type { BlockPartInput } from "./BlockPartInput";

export interface BlockDropdownProvider {
    renderOption(option: BlockDropdownOption, parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput;
    getOptions(block: BlockInstance) : BlockDropdownOption[];
}