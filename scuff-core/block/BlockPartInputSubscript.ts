import { BlockScriptInput } from "./BlockScriptInput";
import type { BlockType } from "./BlockType";
import { BlockPartInput } from "./BlockPartInput";
import type { BlockInput } from "./BlockInput";

export class BlockPartInputSubscript extends BlockPartInput<BlockScriptInput> {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => new BlockScriptInput());
    }

    public isValidValue(value: BlockInput): BlockScriptInput | false {
        if (value instanceof BlockScriptInput)
            return value;
        return false;
    }
}
