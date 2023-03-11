import { BlockDropdownOption, BlockInput, BlockInstance, BlockPartInputFactory, BlockType, ScuffrElementInput, ScuffrElementInputDropdown, ScuffrReferenceInput, ScuffrShape, ScuffrShapeInputRound } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";
import { ScratchDropdownOptionProvider, ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownRound extends ScratchInputTypeDropdown<BlockDropdownOption | BlockInstance> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrElementInput {
            return new ScuffrElementInputDropdown(reference, ScratchInputTypeDropdownRound.shape, ["scuff-block-input-round"], option);
        }
    };

    public static create(name: string, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeDropdownRound(id, name, type, optionProvider);
    }

    public constructor(id: number, name: string, block: BlockType, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]) {
        super(id, name, block, ScratchInputTypeDropdownRound.optionRenderer, optionProvider);;
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