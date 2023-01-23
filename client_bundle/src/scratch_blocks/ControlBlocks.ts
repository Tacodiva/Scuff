import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeBoolean, BlockInputTypeString, BlockInputTypeSubscript } from "../block/BlockInputType";
import { BlockSubscriptInput } from "../block/BlockScript";
import { BlockTypeStackable } from "../block/BlockTypeStackable";
import { raw } from "../l10n";

export class ControlBlockIf extends BlockTypeStackable {

    public readonly inputOne: BlockInputTypeString;
    public readonly inputTwo: BlockInputTypeBoolean;

    constructor() {
        super("control_if")
        this.init({
            text: raw("if % then %"),
            inputs: [
                this.inputTwo = new BlockInputTypeBoolean("idk", this),
                this.inputOne = new BlockInputTypeSubscript("testI", this)
            ],
            category: BlockCategory.CONTROL
        });
    }
}


export class ControlBlockForever extends BlockTypeStackable {

    public readonly inputOne: BlockInputTypeString;

    constructor() {
        super("control_if")
        this.init({
            text: raw("forever %"),
            inputs: [
                this.inputOne = new BlockInputTypeSubscript("testI", this),
            ],
            category: BlockCategory.CONTROL
        });
    }
}