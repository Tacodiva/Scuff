import { ScratchBlockTypeRound } from "../block/block-types/ScratchBlockTypeRound";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";

export class OperatorBlockPlus extends ScratchBlockTypeRound {
    static create(): OperatorBlockPlus {
        return new OperatorBlockPlus(
            ScratchBlockTypeRound.parseDescription({
                id: "op_add",
                text: l10n.raw("% + %"),
                inputs: [
                    ScratchInputTypeNumber.create("test", 5),
                    ScratchInputTypeNumber.create("testII", 10),
                ],
                category: ScratchCategories.operator,
            })
        );
    }
}

export class OperatorBlockEquals extends ScratchBlockTypeTriangle {
    static create(): OperatorBlockEquals {
        return new OperatorBlockEquals(
            ScratchBlockTypeTriangle.parseDescription({
                id: "op_equals",
                text: l10n.raw("% = %"),
                inputs: [
                    ScratchInputTypeString.create("test", ""),
                    ScratchInputTypeString.create("testII", "50"),
                ],
                category: ScratchCategories.operator,
            })
        );
    }
}
