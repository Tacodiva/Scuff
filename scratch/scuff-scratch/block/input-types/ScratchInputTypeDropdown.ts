import { BlockType, BlockInput, BlockInstance, BlockDropdownOption, BlockDropdownProvider, BlockPartInputDropdown, ScuffrSvgInput, ScuffrReferenceInput } from "scuff";

export interface ScratchDropdownOptionRenderer {
    renderOption(option: BlockDropdownOption, reference: ScuffrReferenceInput): ScuffrSvgInput;
}

export type ScratchDropdownOptionShorthand = [id: string, text: string];


export abstract class ScratchInputTypeDropdown<T extends BlockInput> extends BlockPartInputDropdown<T> {

    public static createOptionsAny<T extends Record<string, string>>(renderer: ScratchDropdownOptionRenderer, obj: T): Record<keyof T, BlockDropdownOption> {
        const optionsMap = {} as Record<keyof T, BlockDropdownOption>;
        const optionsList: BlockDropdownOption[] = [];
        const provider = {
            ...renderer,
            getOptions: () => optionsList
        };
        for (const key in obj) {
            const option = new BlockDropdownOption(provider, key, obj[key]);
            optionsMap[key] = option;
            optionsList.push(option);
        }
        return optionsMap;
    }

    public constructor(id: number, name: string, block: BlockType, options: BlockDropdownOption[] | BlockDropdownProvider) {
        if (Array.isArray(options)) {
            options = options[0].provider;
        }
        super(id, name, block, options);
    }
}
