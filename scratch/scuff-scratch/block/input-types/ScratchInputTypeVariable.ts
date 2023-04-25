import { BlockInput, BlockInstance, BlockPartInput, BlockPartInputFactory, BlockType } from "scuff";
import { ScratchInputVariable } from "../inputs/ScratchInputVariable";

export class ScratchInputTypeVariable extends BlockPartInput<ScratchInputVariable> {

    public static create(name: string): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeVariable(id, name, type);
    }

    public constructor(id: number, name: string, block: BlockType) {
        super(id, name, block, () => new ScratchInputVariable(null));
    }

    public isValidValue(block: BlockInstance, value: BlockInput): false {
        return false;
    }
}
