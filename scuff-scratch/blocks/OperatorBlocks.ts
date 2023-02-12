import { ScratchBlockTypeRound } from "../block/block-types/ScratchBlockTypeRound";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";

export class OperatorBlockPlus extends ScratchBlockTypeRound {

    constructor() {
        super("op_add")
        this.init({
            text: l10n.raw("% + %"),
            inputs: [
                new ScratchInputTypeNumber("test", this, 5),
                new ScratchInputTypeNumber("testII", this, 10),
            ],
            category: ScratchBlockCategory.OPERATORS
        });
    }
}

export class OperatorBlockEquals extends ScratchBlockTypeTriangle {

    constructor() {
        super("op_equals")
        this.init({
            text: l10n.raw("% = %"),
            inputs: [
                new ScratchInputTypeString("test", this, ""),
                new ScratchInputTypeString("testII", this, "50"),
            ],
            category: ScratchBlockCategory.OPERATORS
        });
    }
}