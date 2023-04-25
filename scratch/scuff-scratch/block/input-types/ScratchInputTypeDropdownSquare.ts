import { BlockDropdownOption, BlockPartInputFactory, BlockType, ScuffrSvgInput, ScuffrSvgInputDropdown, ScuffrReferenceInput, ScuffrShape, ScuffrShapeInputSquare, BlockDropdownProvider } from "scuff";
import { ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownSquare extends ScratchInputTypeDropdown<BlockDropdownOption> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputSquare();

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrSvgInput {
            return new ScuffrSvgInputDropdown(reference, ScratchInputTypeDropdownSquare.shape, ["scuff-block-input-square"], option);
        }
    };

    public static createOptions<T extends Record<string, string>>(obj: T): Record<keyof T, BlockDropdownOption> {
        return ScratchInputTypeDropdown.createOptionsAny(ScratchInputTypeDropdownSquare.optionRenderer, obj);
    }

    public static create(name: string, options: BlockDropdownOption[] | BlockDropdownProvider): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeDropdownSquare(id, name, type, options);
    }

    public constructor(id: number, name: string, block: BlockType, options: BlockDropdownOption[] | BlockDropdownProvider) {
        super(id, name, block, options);
    }
}