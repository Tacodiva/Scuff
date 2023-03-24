import { l10n } from "scuff";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeDropdownRound } from "../block/input-types/ScratchInputTypeDropdownRound";
import { ScratchCategories } from "../block/ScratchBlockCategory";

export class SensingBlockKeyPressed extends ScratchBlockTypeTriangle {
    static create(): SensingBlockKeyPressed {
        return new SensingBlockKeyPressed(
            ScratchBlockTypeTriangle.parseDescription({
                id: "key_pressed",
                text: l10n.raw("key % pressed?"),
                inputs: [
                    ScratchInputTypeDropdownRound.create("testI", [
                        ["color", "space"],
                        ["fisheye", "up arrow"],
                        ["whirl", "down arrow"],
                        ["pixelate", "right arrow"],
                        ["mosaic", "left arrow"],
                        ["brightness", "any"],
                        ["a", "a"],
                        ["b", "b"],
                        ["c", "c"],
                        ["d", "d"],
                        ["e", "e"],
                        ["f", "f"],
                    ]),
                ],
                category: ScratchCategories.sensing,
            })
        );
    }
}
