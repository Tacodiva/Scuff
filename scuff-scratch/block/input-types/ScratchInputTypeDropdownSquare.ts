import { BlockDropdownOption, BlockPartInput, BlockPartInputDropdown, BlockType, ScuffrBlockReference, ScuffrElementBlockContent, ScuffrElementBlockInstance, ScuffrElementInput, ScuffrElementInputBlank, ScuffrElementInputDropdown, ScuffrShape, ScuffrShapeInputSquare } from "scuff";
import { ScratchDropdownOptionProvider, ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownSquare extends ScratchInputTypeDropdown<BlockDropdownOption> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputSquare();

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput {
            return new ScuffrElementInputDropdown(parent.content, ScratchInputTypeDropdownSquare.shape, "scuff-block-input-square", parentRef.childKey, option);
        }
    };

    public constructor(id: string, block: BlockType, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]) {
        super(id, block, ScratchInputTypeDropdownSquare.optionRenderer, optionProvider);;
    }
}