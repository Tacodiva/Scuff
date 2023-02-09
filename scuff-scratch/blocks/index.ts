import { ControlBlockForever, ControlBlockIf } from "./ControlBlocks";
import { EventGreenFlagClicked } from "./EventBlocks";
import { MotionBlockMoveSteps } from "./MotionBlocks";
import { OperatorBlockEquals, OperatorBlockPlus } from "./OperatorBlocks";

export const ScratchBlocks = {

    motion: {
        move_steps: new MotionBlockMoveSteps()
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
