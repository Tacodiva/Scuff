import { ScratchInputBoolean } from "../inputs/ScratchInputBoolean";
import { BlockPartInput, BlockType, BlockInput, BlockInstance, BlockPartInputFactory } from "scuff";
import { ScratchBlockTypeTriangle } from "../block-types/ScratchBlockTypeTriangle";

export class ScratchInputTypeBoolean extends BlockPartInput<ScratchInputBoolean | BlockInstance> {

    public static create(name: string): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeBoolean(id, name, type);
    }

    public constructor(id: number, name: string, block: BlockType) {
        super(id, name, block, () => ScratchInputBoolean.INSTANCE);
    }

    public isValidValue(block: BlockInstance, value: BlockInput): ScratchInputBoolean | BlockInstance | false {
        if (value instanceof ScratchInputBoolean)
            return value;
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeTriangle ? value : false;
        return false;
    }
}
