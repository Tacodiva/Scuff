import BlockCategory from "../BlockCategory";
import { raw } from "../../l10n";
import { StackableBlockType } from "../BlockTypeStackable";
import { BlockInputTypeString } from "../BlockInputType";
import { SVGBlockRenderer } from "../svg/SVGBlockRenderer";

class MoveStepsBlock extends StackableBlockType {

    public readonly inputOne: BlockInputTypeString;
    // public readonly inputTwo : BlockInputTypeString;

    constructor() {
        super("move_steps")
        this.init({
            text: raw("move % steps"),
            inputs: [
                this.inputOne = new BlockInputTypeString("test", this, "69"),
                // this.inputTwo = new BlockInputTypeString("testII", this, "World")
            ],
            category: BlockCategory.MOTION,
            renderer: new SVGBlockRenderer(this)
        });
    }
}

export { MoveStepsBlock };