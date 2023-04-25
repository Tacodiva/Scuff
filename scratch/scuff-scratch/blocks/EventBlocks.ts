import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { BlockPartIcon, l10n } from "scuff";
import { registerSB3Block } from "../sb3-parser";

export class EventGreenFlagClicked extends ScratchBlockTypeStackable {
    public static INSTANCE = new EventGreenFlagClicked(
        ScratchBlockTypeStackable.parseDescription({
            id: "scratch:event_whenflagclicked",
            text: l10n.raw("when $ clicked"),
            category: ScratchCategories.event,
            shape: ScratchStackableBlockShape.HEAD,
            decoration: [
                (type) => new BlockPartIcon("scuff-block-green-flag", { x: 24, y: 24 }),
            ],
        })
    );
}

registerSB3Block("event_whenflagclicked", () => EventGreenFlagClicked.INSTANCE.createInstance());
