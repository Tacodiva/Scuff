import { l10n } from "scuff";
import { ScratchBlockTypeTriangle } from "../block/block-types/ScratchBlockTypeTriangle";
import { ScratchInputTypeDropdownRound } from "../block/input-types/ScratchInputTypeDropdownRound";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";

export class SensingBlockKeyPressed extends ScratchBlockTypeTriangle {

    constructor() {
        super("key_pressed")
        this.init({
            text: l10n.raw("key % pressed?"),
            inputs: [
                new ScratchInputTypeDropdownRound("testI", this, [
                    ["color", "space"],
                    ["fisheye", "up arrow"],
                    ["whirl", "down arrow"],
                    ["pixelate", "right arrow"],
                    ["mosaic", "left arrow"],
                    ["brightness", "any"],
                    ["ghost", "a"],
                ]),
            ],
            category: ScratchBlockCategory.SENSING
        });
    }
}