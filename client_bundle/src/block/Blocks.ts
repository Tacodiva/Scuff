import type BlockType from "./BlockType";
import { MoveStepsBlock } from "./types/MoveStepsBlock";
import { OpPlusBlock } from "./types/OperatorBlocks";

class Blocks {

    private constructor() { }

    public static readonly REGISTRY: BlockType[] = [];

    private static _register<T extends BlockType>(block: T): T {
        this.REGISTRY.push(block);
        return block;
    }

    public static readonly MOVE_STEPS = Blocks._register(new MoveStepsBlock());
    public static readonly OP_PLUS = Blocks._register(new OpPlusBlock());
}

export default Blocks;