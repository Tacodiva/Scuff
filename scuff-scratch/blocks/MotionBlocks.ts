import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";

export class MotionBlockMoveSteps extends ScratchBlockTypeStackable {

    constructor() {
        super("move_steps")
        this.init({
            text: l10n.raw("move % steps"),
            inputs: [
                new ScratchInputTypeString("test", this, "69"),
            ],
            category: ScratchBlockCategory.MOTION
        });
    }
}