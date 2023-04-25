import { l10n } from "scuff";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeDropdownRound } from "../block/input-types/ScratchInputTypeDropdownRound";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { OptionsKey } from "./DropdownOptions";

// export class SensingBlockKeyPressed extends ScratchBlockTypeTriangle {
//     static create(): SensingBlockKeyPressed {
//         return new SensingBlockKeyPressed(
//             ScratchBlockTypeTriangle.parseDescription({
//                 id: "sensing_keypressed",
//                 text: l10n.raw("key % pressed?"),
//                 inputs: [
//                     ScratchInputTypeDropdownRound.create("testI", Object.values(OptionsKey)),
//                 ],
//                 category: ScratchCategories.sensing,
//             })
//         );
//     }
// }
