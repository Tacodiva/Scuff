import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { BlockPartInputSubscript, l10n } from "scuff";
import { ScratchInputTypeBoolean } from "../block/input-types/ScratchInputTypeBoolean";

export class ControlBlockIf extends ScratchBlockTypeStackable {

    constructor() {
        super("control_if")
        this.init({
            text: l10n.raw("if % then %"),
            inputs: [
                new ScratchInputTypeBoolean("idk", this),
                new BlockPartInputSubscript("testI", this)
            ],
            category: ScratchBlockCategory.CONTROL
        });
    }
}


export class ControlBlockForever extends ScratchBlockTypeStackable {

    constructor() {
        super("control_forever")
        this.init({
            text: l10n.raw("forever %"),
            inputs: [
                new BlockPartInputSubscript("testI", this),
            ],
            category: ScratchBlockCategory.CONTROL,
            shape: ScratchStackableBlockShape.TAIL
        });
    }
}