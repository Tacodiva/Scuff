import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { BlockDropdownOption, l10n } from "scuff";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";
import { ScratchInputTypeDropdown } from "../block/input-types/ScratchInputTypeDropdown";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";

export class MotionBlockMoveSteps extends ScratchBlockTypeStackable {

    constructor() {
        super("move_steps")
        this.init({
            text: l10n.raw("move % steps"),
            inputs: [
                new ScratchInputTypeNumber("test", this, 69)
            ],
            category: ScratchBlockCategory.MOTION
        });
    }
}