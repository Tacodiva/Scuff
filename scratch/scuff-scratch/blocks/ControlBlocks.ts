import { ScratchCategories } from "../block/ScratchBlockCategory";
import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { BlockPartInputSubscript, l10n } from "scuff";
import { ScratchInputTypeBoolean } from "../block/input-types/ScratchInputTypeBoolean";

export class ControlBlockIf extends ScratchBlockTypeStackable {

    public static create(): ControlBlockIf {
        return new ControlBlockIf(
            ScratchBlockTypeStackable.parseDescription({
                id: "control_if",
                text: l10n.raw("if % then %"),
                inputs: [
                    ScratchInputTypeBoolean.create("idk"),
                    BlockPartInputSubscript.create("testI")
                ],
                category: ScratchCategories.control
            }));
    }
}


export class ControlBlockForever extends ScratchBlockTypeStackable {
    static create(): ControlBlockForever {
        return new ControlBlockForever(
            ScratchBlockTypeStackable.parseDescription({
                id: "control_forever",
                text: l10n.raw("forever %"),
                inputs: [BlockPartInputSubscript.create("testI")],
                category: ScratchCategories.control,
                shape: ScratchStackableBlockShape.TAIL,
            })
        );
    }
}