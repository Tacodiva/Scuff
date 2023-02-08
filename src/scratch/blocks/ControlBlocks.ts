import { BlockCategory } from "../../src/block/BlockCategory";
import { BlockInputTypeBoolean } from "../../src/block/BlockInputTypeBoolean";
import type { BlockInputTypeString } from "../../src/block/BlockInputTypeString";
import { BlockInputTypeSubscript } from "../../src/block/BlockInputTypeSubscript";
import { BlockTypeStackable, StackableBlockShape } from "../../src/block/BlockTypeStackable";
import { raw } from "../../src/l10n";

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
        super("control_forever")
        this.init({
            text: raw("forever %"),
            inputs: [
                this.inputOne = new BlockInputTypeSubscript("testI", this),
            ],
            category: BlockCategory.CONTROL,
            shape: StackableBlockShape.TAIL
        });
    }
}