import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { EventGreenFlagClicked } from "./EventBlocks";
import { LooksBlockSay, LooksBlockSetEffectTo } from "./LooksBlocks";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockEquals, OperatorBlockPlus } from "./OperatorBlocks";
import { SensingBlockKeyPressed } from "./SensingBlocks";

export const ScratchBlocks = {
    motion: {
        move_steps: MotionBlockMoveSteps.create(),
    },
    looks: {
        say: LooksBlockSay.create(),
        set_effect_to: LooksBlockSetEffectTo.create(),
    },
    event: {
        flag_clicked: EventGreenFlagClicked.create(),
    },
    control: {
        if: ControlBlockIf.create(),
        forever: ControlBlockForever.create(),
    },
    sensing: {
        key_pressed: SensingBlockKeyPressed.create(),
    },
    operator: {
        add: OperatorBlockPlus.create(),
        equals: OperatorBlockEquals.create(),
    },
} as const;

