import { ScratchInputString } from "../inputs/ScratchInputString";
import { BlockPartInput, BlockType, BlockInput, BlockInstance } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";

export class ScratchInputTypeString extends BlockPartInput<ScratchInputString | BlockInstance> {
    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, () => new ScratchInputString(defaultValue));
    }

    public isValidValue(value: BlockInput): ScratchInputString | BlockInstance | false {
        if (value instanceof ScratchInputString) return value;
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeInput ? value : false;
        return false;
    }
}
