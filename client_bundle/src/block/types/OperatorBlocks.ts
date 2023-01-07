import { raw } from "../../l10n";
import BlockCategory from "../BlockCategory";
import { BlockInputTypeString } from "../BlockInputType";
import RoundBlockType from "../BlockTypeRound";
import { StackableBlockType } from "../BlockTypeStackable";
import { SVGBlockRenderer } from "../svg/SVGBlockRenderer";

class OpPlusBlock extends RoundBlockType {

    public readonly inputOne: BlockInputTypeString;
    public readonly inputTwo: BlockInputTypeString;

    constructor() {
        super("op_add")
        this.init({
            text: raw("% + %"),
            inputs: [
                this.inputOne = new BlockInputTypeString("test", this, "5"),
                this.inputTwo = new BlockInputTypeString("testII", this, "10"),
            ],
            category: BlockCategory.OPERATORS,
            renderer: new SVGBlockRenderer(this)
        });
    }
}

export { OpPlusBlock };