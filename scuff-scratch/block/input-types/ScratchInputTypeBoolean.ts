import { ScratchInputBoolean } from "../inputs/ScratchInputBoolean";
import { BlockPartInput, BlockType, BlockInput, BlockInstance } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";
import { ScratchBlockTypeTriangle } from "../block-types/ScratchBlockTypeTriangle";

export class ScratchInputTypeBoolean extends BlockPartInput<ScratchInputBoolean | BlockInstance> {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => ScratchInputBoolean.INSTANCE);
    }

    public isValidValue(value: BlockInput): ScratchInputBoolean | BlockInstance | false {
        if (value instanceof ScratchInputBoolean)
            return value;
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeTriangle ? value : false;
        return false;
    }
}
