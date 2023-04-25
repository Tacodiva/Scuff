import { BlockDropdownOption, BlockInput, BlockInstance, BlockPartInputFactory, BlockType, ScuffrSvgInput, ScuffrSvgInputDropdown, ScuffrReferenceInput, ScuffrShape, ScuffrShapeInputRound, BlockDropdownProvider } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";
import { ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownRound extends ScratchInputTypeDropdown<BlockDropdownOption | BlockInstance> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound(32);

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrSvgInput {
            return new ScuffrSvgInputDropdown(reference, ScratchInputTypeDropdownRound.shape, ["scuff-block-input-round"], option);
        }
    };

    public static createOptions<T extends Record<string, string>>(obj: T): Record<keyof T, BlockDropdownOption> {
        return ScratchInputTypeDropdown.createOptionsAny(ScratchInputTypeDropdownRound.optionRenderer, obj);
    }

    public static create(name: string, options: BlockDropdownOption[] | BlockDropdownProvider): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeDropdownRound(id, name, type, options);
    }

    public constructor(id: number, name: string, block: BlockType, options: BlockDropdownOption[] | BlockDropdownProvider) {
        super(id, name, block, options);;
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