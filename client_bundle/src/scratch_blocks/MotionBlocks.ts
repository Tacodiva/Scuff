import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeString } from "../block/BlockInputTypeString";
import { BlockTypeStackable } from "../block/BlockTypeStackable";
import { raw } from "../l10n";

export class MotionBlockMoveSteps extends BlockTypeStackable {

    public readonly inputOne: BlockInputTypeString;

    constructor() {
        super("move_steps")
        this.init({
            text: raw("move % steps"),
            inputs: [
                this.inputOne = new BlockInputTypeString("test", this, "69"),
            ],
            category: BlockCategory.MOTION
        });
    }
}