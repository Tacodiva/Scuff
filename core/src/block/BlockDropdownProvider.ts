import type { ScuffrSvgInput } from "../scuffr";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";
import type { BlockDropdownOption } from "./BlockDropdownOption";
import type { BlockInstance } from "./BlockInstance";

export interface BlockDropdownProvider {
    renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrSvgInput;
    getOptions(block: BlockInstance): BlockDropdownOption[];
}