import { ScratchBlockTypeRound } from "../block/block-types/ScratchBlockTypeRound";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";
import { registerSB3Block } from "../sb3-parser";
import { ScratchBlocks } from ".";

export class OperatorBlockPlus extends ScratchBlockTypeRound {
    public static INSTANCE = new OperatorBlockPlus(
        ScratchBlockTypeRound.parseDescription({
            id: "scratch:operator_add",
            text: l10n.raw("% + %"),
            inputs: [
                ScratchInputTypeNumber.create("a"),
                ScratchInputTypeNumber.create("b"),
            ],
            category: ScratchCategories.operator,
        })
    );
}

registerSB3Block("operator_add", (block, parser) => {
    return OperatorBlockPlus.INSTANCE.createInstance({
        a: parser.parseInput(block.inputs.NUM1),
        b: parser.parseInput(block.inputs.NUM2),
    });
});

export class OperatorBlockEquals extends ScratchBlockTypeTriangle {
    public static INSTANCE = new OperatorBlockEquals(
        ScratchBlockTypeTriangle.parseDescription({
            id: "scratch:operator_equals",
            text: l10n.raw("% = %"),
            inputs: [
                ScratchInputTypeString.create("a"),
                ScratchInputTypeString.create("b", "50"),
            ],
            category: ScratchCategories.operator,
        })
    );
}

registerSB3Block("operator_equals", (block, parser) => {
    return OperatorBlockEquals.INSTANCE.createInstance({
        a: parser.parseInput(block.inputs.OPERAND1),
        b: parser.parseInput(block.inputs.OPERAND2),
    });
});
