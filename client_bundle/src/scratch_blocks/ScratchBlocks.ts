import type { BlockType } from "../block/BlockType";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockPlus } from "./OperatorBlocks";

export class ScratchBlocks {

    private constructor() { }

    public static readonly REGISTRY: BlockType[] = [];

    private static _register<T extends BlockType>(block: T): T {
        this.REGISTRY.push(block);
        return block;
    }

    public static readonly MOVE_STEPS = ScratchBlocks._register(new MotionBlockMoveSteps());
    public static readonly OP_PLUS = ScratchBlocks._register(new OperatorBlockPlus());
}
