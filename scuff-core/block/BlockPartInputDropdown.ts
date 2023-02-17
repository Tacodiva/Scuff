import { BlockScriptInput } from "./BlockScriptInput";
import type { BlockType } from "./BlockType";
import { BlockPartInput } from "./BlockPartInput";
import type { BlockInput } from "./BlockInput";
import type { BlockDropdownProvider } from "./BlockDropdownProvider";
import { BlockDropdownOption } from "./BlockDropdownOption";
import type { BlockInstance } from "./BlockInstance";

export class BlockPartInputDropdown<T extends BlockInput = BlockDropdownOption> extends BlockPartInput<T | BlockDropdownOption> {
    public readonly dropdownProvider: BlockDropdownProvider;

    public constructor(id: string, block: BlockType, optionProvider: BlockDropdownProvider) {
        super(id, block, (blockInst) => optionProvider.getOptions(blockInst)[0]);
        this.dropdownProvider = optionProvider;
    }

    public isValidValue(block: BlockInstance, value: BlockInput): T | BlockDropdownOption | false {
        if (value instanceof BlockDropdownOption) {
            const options = this.dropdownProvider.getOptions(block);
            if (options.findIndex(option => option.id == value.id) === -1)
                return false;
            return value;
        }
        return false;
    }
}
