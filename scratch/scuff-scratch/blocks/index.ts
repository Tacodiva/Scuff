import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { EventGreenFlagClicked } from "./EventBlocks";
import { OperatorBlockEquals, OperatorBlockPlus } from "./OperatorBlocks";
import { VariableBlockSetTo } from "./VariableBlocks";

export const ScratchBlocks = {
    motion: {
        // move_steps: MotionBlockMoveSteps.INSTANCE,
    },
    looks: {
        // say: LooksBlockSay.INSTANCE,
        // set_effect_to: LooksBlockSetEffectTo.INSTANCE,
    },
    event: {
        flag_clicked: EventGreenFlagClicked.INSTANCE,
    },
    control: {
        if: ControlBlockIf.INSTANCE,
        forever: ControlBlockForever.INSTANCE,
    },
    sensing: {
        // key_pressed: SensingBlockKeyPressed.INSTANCE,
    },
    operator: {
        add: OperatorBlockPlus.INSTANCE,
        equals: OperatorBlockEquals.INSTANCE,
    },
    data: {
        set_variable_to: VariableBlockSetTo.INSTANCE
    }
} as const;
