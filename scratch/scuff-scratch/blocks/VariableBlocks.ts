import { l10n } from "scuff";
import { ScratchBlockTypeRound } from "../block/block-types/ScratchBlockTypeRound";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { ScratchInputTypeVariable } from "../block/input-types/ScratchInputTypeVariable";
import { ScratchBlockTypeStackable } from "../block/block-types";
import { ScratchInputTypeNumber } from "../block/input-types/ScratchInputTypeNumber";
import { ScratchInputTypeDropdownSquare } from "../block/input-types/ScratchInputTypeDropdownSquare";
import { OptionsEffect } from "./DropdownOptions";
import { registerSB3Block } from "../sb3-parser";

export class VariableBlockSetTo extends ScratchBlockTypeStackable {
    public static INSTANCE = new VariableBlockSetTo(
        ScratchBlockTypeStackable.parseDescription({
            id: "scratch:data_setvariableto",
            text: l10n.raw("set % to %"),
            inputs: [
                ScratchInputTypeDropdownSquare.create("effect", Object.values(OptionsEffect)),
                ScratchInputTypeNumber.create("value", 0),
            ],
            category: ScratchCategories.variable,
        })
    );
}

registerSB3Block("data_setvariableto", (block, parser) => {
    console.log(block);
    return VariableBlockSetTo.INSTANCE.createInstance();
});
