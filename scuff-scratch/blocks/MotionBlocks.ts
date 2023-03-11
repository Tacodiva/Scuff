import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { BlockDropdownOption, l10n } from "scuff";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";
import { ScratchInputTypeDropdown } from "../block/input-types/ScratchInputTypeDropdown";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";

export class MotionBlockMoveSteps extends ScratchBlockTypeStackable {
    static create(): MotionBlockMoveSteps {
        return new MotionBlockMoveSteps(
            ScratchBlockTypeStackable.parseDescription({
                id: "move_steps",
                text: l10n.raw("move % steps"),
                inputs: [ScratchInputTypeNumber.create("test", 69)],
                category: ScratchBlockCategory.MOTION,
            })
        );
    }
}