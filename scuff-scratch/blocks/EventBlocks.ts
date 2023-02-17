import { ScratchBlockTypeStackable, ScratchStackableBlockShape } from "../block/block-types/ScratchBlockTypeStackable";
import { ScratchBlockCategory } from "../block/ScratchBlockCategory";
import { BlockPartIcon, l10n } from "scuff";

export class EventGreenFlagClicked extends ScratchBlockTypeStackable {

    constructor() {
        super("events_green_flag")
        this.init({
            text: l10n.raw("when $ clicked"),
            category: ScratchBlockCategory.EVENTS,
            shape: ScratchStackableBlockShape.HEAD,
            decoration: [
                type => new BlockPartIcon("scuff-block-green-flag", { x: 24, y: 24 })
            ]
        });

    }
}