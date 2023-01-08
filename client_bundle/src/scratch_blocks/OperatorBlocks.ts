import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeString } from "../block/BlockInputType";
import { BlockTypeRound } from "../block/BlockTypeRound";
import { raw } from "../l10n";

export class OperatorBlockPlus extends BlockTypeRound {

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
            category: BlockCategory.OPERATORS
        });
    }
}