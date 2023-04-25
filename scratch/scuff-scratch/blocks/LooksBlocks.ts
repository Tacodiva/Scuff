import { ScratchBlockTypeDataStackable, ScratchBlockTypeStackable } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchInputTypeString } from "../block/input-types/ScratchInputTypeString";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { BlockInstance, l10n } from "scuff";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";
import { SB3 } from "../sb3";
import { SB3Parser } from "../sb3-parser";
import { OptionsEffect } from "./DropdownOptions";

// export class LooksBlockSay extends ScratchBlockTypeStackable {
//     static create(): LooksBlockSay {
//         return new LooksBlockSay(
//             ScratchBlockTypeStackable.parseDescription({
//                 id: "looks_say",
//                 text: l10n.raw("say %"),
//                 inputs: [
//                     ScratchInputTypeString.create("test", "Hello, World!")
//                 ],
//                 category: ScratchCategories.looks,
//             })
//         );
//     }
// }

// export class LooksBlockSetEffectTo extends ScratchBlockTypeStackable<"looks_seteffectto"> {
//     static create(): LooksBlockSetEffectTo {
//         return new LooksBlockSetEffectTo(
//             ScratchBlockTypeStackable.parseDescription({
//                 id: "looks_seteffectto",
//                 text: l10n.raw("set % effect to %"),
//                 inputs: [
//                     ScratchInputTypeDropdownSquare.create("effect", Object.values(OptionsEffect)),
//                     ScratchInputTypeNumber.create("value", 0),
//                 ],
//                 category: ScratchCategories.looks,
//             })
//         );
//     }

//     public constructor(desc: ScratchBlockTypeDataStackable<"looks_seteffectto">) {
//         super(desc);
//     }

//     public override parseSB3(block: SB3.Blocks.Looks.SetEffectTo, parser: SB3Parser): BlockInstance {
//         return this.createInstance({
//             effect: OptionsEffect[block.fields.EFFECT[0]],
//             value: parser.parseInput(block.inputs.VALUE)
//         });
//     }
// }