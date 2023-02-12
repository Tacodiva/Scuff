import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";

export class LooksBlockSay extends ScratchBlockTypeStackable {

    constructor() {
        super("looks_say")
        this.init({
            text: l10n.raw("say %"),
            inputs: [
                new ScratchInputTypeString("test", this, "Hello, World!")
            ],
            category: ScratchBlockCategory.LOOKS
        });
    }
}