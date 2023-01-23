import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeString } from "../block/BlockInputType";
import { BlockTypeBoolean } from "../block/BlockTypeBoolean";
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

export class OperatorBlockEquals extends BlockTypeBoolean {

    public readonly inputOne: BlockInputTypeString;
    public readonly inputTwo: BlockInputTypeString;

    constructor() {
        super("op_equals")
        this.init({
            text: raw("% = %"),
            inputs: [
                this.inputOne = new BlockInputTypeString("test", this, ""),
                this.inputTwo = new BlockInputTypeString("testII", this, "50"),
            ],
            category: BlockCategory.OPERATORS
        });
    }   
}