import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";

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

export class LooksBlockSetEffectTo extends ScratchBlockTypeStackable {
    constructor() {
        super("set_effect_to")
        this.init({
            text: l10n.raw("set % effect to %"),
            inputs: [
                new ScratchInputTypeDropdownSquare("testI", this, [
                    ["color", "color"],
                    ["fisheye", "fisheye"],
                    ["whirl", "whirl"],
                    ["pixelate", "pixelate"],
                    ["mosaic", "mosaic"],
                    ["brightness", "brightness"],
                    ["ghost", "ghost"],
                ]),
                new ScratchInputTypeNumber("test", this, 0)
            ],
            category: ScratchBlockCategory.LOOKS
        });
    }
}