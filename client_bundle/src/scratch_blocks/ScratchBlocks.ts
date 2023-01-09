import type { BlockType } from "../block/BlockType";
import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockPlus } from "./OperatorBlocks";

export class ScratchBlocks {

    private constructor() { }

    public static readonly REGISTRY: BlockType[] = [];

    private static _register<T extends BlockType>(block: T): T {
        this.REGISTRY.push(block);
        return block;
    }

    public static readonly MOTION_MOVE_STEPS = ScratchBlocks._register(new MotionBlockMoveSteps());
    public static readonly OPERATOR_PLUS = ScratchBlocks._register(new OperatorBlockPlus());
    public static readonly CONTROL_IF = ScratchBlocks._register(new ControlBlockIf());
    public static readonly CONTROL_FOREVER = ScratchBlocks._register(new ControlBlockForever());
}
