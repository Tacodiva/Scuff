import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { EventGreenFlagClicked } from "./EventBlocks";
import { LooksBlockSay, LooksBlockSetEffectTo } from "./LooksBlocks";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockEquals, OperatorBlockPlus } from "./OperatorBlocks";
import { SensingBlockKeyPressed } from "./SensingBlocks";

export const ScratchBlocks = {

    motion: {
        move_steps: new MotionBlockMoveSteps(),
    },

    looks: {
        say: new LooksBlockSay(),
        set_effect_to: new LooksBlockSetEffectTo()
    },

    event: {
        flag_clicked: new EventGreenFlagClicked()
    },
    
    control: {
        if: new ControlBlockIf(),
        forever: new ControlBlockForever()
    },

    sensing: {
        key_pressed: new SensingBlockKeyPressed()
    },

    operator: {
        add: new OperatorBlockPlus(),
        equals: new OperatorBlockEquals()
    },

}
