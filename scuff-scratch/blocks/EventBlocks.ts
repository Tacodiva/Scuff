import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchCategories } from "../block/ScratchBlockCategory";
import { BlockPartIcon, l10n } from "scuff";

export class EventGreenFlagClicked extends ScratchBlockTypeStackable {
    static create(): EventGreenFlagClicked {
        return new EventGreenFlagClicked(
            ScratchBlockTypeStackable.parseDescription({
                id: "events_green_flag",
                text: l10n.raw("when $ clicked"),
                category: ScratchCategories.event,
                shape: ScratchStackableBlockShape.HEAD,
                decoration: [
                    (type) => new BlockPartIcon("scuff-block-green-flag", { x: 24, y: 24 }),
                ],
            })
        );
    }
}