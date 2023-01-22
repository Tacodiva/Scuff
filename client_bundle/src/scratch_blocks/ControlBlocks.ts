import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeString, BlockInputTypeSubscript } from "../block/BlockInputType";
import { BlockSubscriptInput } from "../block/BlockScript";
import { BlockTypeStackable } from "../block/BlockTypeStackable";
import { raw } from "../l10n";

export class ControlBlockIf extends BlockTypeStackable {

    public readonly inputOne: BlockInputTypeString;
    public readonly inputTwo: BlockInputTypeString;

    constructor() {
        super("control_if")
        this.init({
            text: raw("if then % else % "),
            inputs: [
                this.inputOne = new BlockInputTypeSubscript("testI", this),
                this.inputTwo = new BlockInputTypeSubscript("testII", this),
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