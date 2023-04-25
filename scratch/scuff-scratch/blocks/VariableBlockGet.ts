import { l10n } from "scuff";
import { ScratchBlockTypeRound } from "../block/block-types/ScratchBlockTypeRound";
import { ScratchInputTypeVariable } from "../block/input-types/ScratchInputTypeVariable";
import { ScratchCategories } from "../block/ScratchBlockCategory";

export class VariableBlockGet extends ScratchBlockTypeRound {
    public static INSTANCE = new VariableBlockGet(
        ScratchBlockTypeRound.parseDescription({
            id: "scuff:variable_get",
            text: l10n.raw("%"),
            inputs: [
                ScratchInputTypeVariable.create("variable")
            ],
            category: ScratchCategories.variable,
        })
    );
}
