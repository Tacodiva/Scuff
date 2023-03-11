import { ScratchInputString } from "../inputs/ScratchInputString";
import { BlockPartInput, BlockType, BlockInput, BlockInstance, BlockPartInputFactory } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";

export class ScratchInputTypeString extends BlockPartInput<ScratchInputString | BlockInstance> {
    
    public static create(name: string, defaultValue?: string): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeString(id, name, type, defaultValue);
    }

    public constructor(id: number, name: string, block: BlockType, defaultValue: string = "") {
        super(id, name, block, () => new ScratchInputString(defaultValue));
    }

    public isValidValue(block: BlockInstance, value: BlockInput): ScratchInputString | BlockInstance | false {
        if (value instanceof ScratchInputString) return value;
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeInput ? value : false;
        return false;
    }
}
