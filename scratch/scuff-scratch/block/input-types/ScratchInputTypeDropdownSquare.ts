import { BlockDropdownOption, BlockPartInputFactory, BlockType, ScuffrSvgInput, ScuffrSvgInputDropdown, ScuffrReferenceInput, ScuffrShape, ScuffrShapeInputSquare } from "scuff";
import { ScratchDropdownOptionProvider, ScratchDropdownOptionRenderer, ScratchDropdownOptionShorthand, ScratchInputTypeDropdown } from "./ScratchInputTypeDropdown";

export class ScratchInputTypeDropdownSquare extends ScratchInputTypeDropdown<BlockDropdownOption> {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputSquare();

    public static readonly optionRenderer: ScratchDropdownOptionRenderer = {
        renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrSvgInput {
            return new ScuffrSvgInputDropdown(reference, ScratchInputTypeDropdownSquare.shape, ["scuff-block-input-square"], option);
        }
    };

    public static create(name: string, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeDropdownSquare(id, name, type, optionProvider);
    }

    public constructor(id: number, name: string, block: BlockType, optionProvider: ScratchDropdownOptionProvider | ScratchDropdownOptionShorthand[]) {
        super(id, name, block, ScratchInputTypeDropdownSquare.optionRenderer, optionProvider);;
    }
}