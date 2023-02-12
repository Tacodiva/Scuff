import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { EventGreenFlagClicked } from "./EventBlocks";
import { LooksBlockSay } from "./LooksBlocks";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockEquals, OperatorBlockPlus } from "./OperatorBlocks";

export const ScratchBlocks = {

    motion: {
        move_steps: new MotionBlockMoveSteps()
    },

    looks: {
        say: new LooksBlockSay()
    },

    event: {
        flag_clicked: new EventGreenFlagClicked()
    },

    operator: {
        add: new OperatorBlockPlus(),
        equals: new OperatorBlockEquals()
    },

    control: {
        if: new ControlBlockIf(),
        forever: new ControlBlockForever()
    }
}
