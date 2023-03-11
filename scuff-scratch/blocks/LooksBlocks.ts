import { ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { l10n } from "scuff";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";

export class LooksBlockSay extends ScratchBlockTypeStackable {
    static create(): LooksBlockSay {
        return new LooksBlockSay(
            ScratchBlockTypeStackable.parseDescription({
                id: "looks_say",
                text: l10n.raw("say %"),
                inputs: [
                    ScratchInputTypeString.create("test", "Hello, World!")
                ],
                category: ScratchBlockCategory.LOOKS,
            })
        );
    }
}

export class LooksBlockSetEffectTo extends ScratchBlockTypeStackable {
    static create(): LooksBlockSetEffectTo {
        return new LooksBlockSetEffectTo(
            ScratchBlockTypeStackable.parseDescription({
                id: "set_effect_to",
                text: l10n.raw("set % effect to %"),
                inputs: [
                    ScratchInputTypeDropdownSquare.create("testI", [
                        ["color", "color"],
                        ["fisheye", "fisheye"],
                        ["whirl", "whirl"],
                        ["pixelate", "pixelate"],
                        ["mosaic", "mosaic"],
                        ["brightness", "brightness"],
                        ["ghost", "ghost"],
                    ]),
                    ScratchInputTypeNumber.create("test", 0),
                ],
                category: ScratchBlockCategory.LOOKS,
            })
        );
    }
}