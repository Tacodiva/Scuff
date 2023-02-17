import { BlockDropdownOption, BlockInput, BlockInstance, BlockPartInput, BlockPartInputDropdown, BlockType, ScuffrBlockReference, ScuffrElementBlockContent, ScuffrElementBlockInstance, ScuffrElementInput, ScuffrElementInputBlank, ScuffrElementInputDropdown, ScuffrShape, ScuffrShapeInputRound, ScuffrShapeInputSquare } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";
import { ScratchDropdownOptionProvider, ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownRound extends ScratchInputTypeDropdown<BlockDropdownOption | BlockInstance> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput {
            return new ScuffrElementInputDropdown(parent.content, ScratchInputTypeDropdownRound.shape, "scuff-block-input-round", parentRef.childKey, option);
        }
    };

    public constructor(id: string, block: BlockType, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]) {
        super(id, block, ScratchInputTypeDropdownRound.optionRenderer, optionProvider);;
    }

    public override isValidValue(block: BlockInstance, value: BlockInput): BlockDropdownOption | BlockInstance | false {
        let cast = super.isValidValue(block, value);
        if (cast)
            return cast;
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeInput ? value : false;
        return false;
    }
}