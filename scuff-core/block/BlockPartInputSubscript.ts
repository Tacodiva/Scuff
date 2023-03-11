import { BlockScriptInput } from "./BlockScriptInput";
import type { BlockPartInputFactory, BlockType } from "./BlockType";
import { BlockPartInput } from "./BlockPartInput";
import type { BlockInput } from "./BlockInput";
import type { BlockInstance } from "./BlockInstance";

export class BlockPartInputSubscript extends BlockPartInput<BlockScriptInput> {

    public static create(name: string): BlockPartInputFactory {
        return (type, id) => new BlockPartInputSubscript(id, name, type);
    }

    public constructor(index: number, name: string, block: BlockType) {
        super(index, name, block, () => new BlockScriptInput());
    }

    public isValidValue(block: BlockInstance, value: BlockInput): BlockScriptInput | false {
        if (value instanceof BlockScriptInput)
            return value;
        return false;
    }
}
