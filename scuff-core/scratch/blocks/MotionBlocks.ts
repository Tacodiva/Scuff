import { BlockCategory } from "../../src/block/BlockCategory";
import { BlockInputTypeString } from "../../src/block/BlockInputTypeString";
import { BlockTypeStackable } from "../../src/block/BlockTypeStackable";
import { raw } from "../../src/l10n";

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