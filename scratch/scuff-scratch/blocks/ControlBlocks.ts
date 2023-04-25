import { ScratchCategories } from "../block/ScratchBlockCategory";
import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { BlockPartInputSubscript, l10n } from "scuff";
import { ScratchInputTypeBoolean } from "../block/input-types/ScratchInputTypeBoolean";
import { registerSB3Block } from "../sb3-parser";
import { ScratchBlocks } from ".";

export class ControlBlockIf extends ScratchBlockTypeStackable {
    public static INSTANCE = new ControlBlockIf(
        ScratchBlockTypeStackable.parseDescription({
            id: "scratch:control_if",
            text: l10n.raw("if % then %"),
            inputs: [
                ScratchInputTypeBoolean.create("condition"),
                BlockPartInputSubscript.create("body")
            ],
            category: ScratchCategories.control
        }));
}

registerSB3Block("control_if", (block, parser) => {
    return ControlBlockIf.INSTANCE.createInstance({
        condition: parser.parseBoolean(block.inputs.CONDITION),
        body: parser.parseSubstack(block.inputs.SUBSTACK),
    });
});

export class ControlBlockForever extends ScratchBlockTypeStackable {
    public static INSTANCE = new ControlBlockForever(
        ScratchBlockTypeStackable.parseDescription({
            id: "scratch:control_forever",
            text: l10n.raw("forever %"),
            inputs: [BlockPartInputSubscript.create("body")],
            category: ScratchCategories.control,
            shape: ScratchStackableBlockShape.TAIL,
        })
    );
}

registerSB3Block("control_forever", (block, parser) => {
    return ControlBlockForever.INSTANCE.createInstance({
        body: parser.parseSubstack(block.inputs.SUBSTACK),
    });
});