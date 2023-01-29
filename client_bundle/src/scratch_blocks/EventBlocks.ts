import { BlockCategory } from "../block/BlockCategory";
import { BlockInputTypeSubscript } from "../block/BlockInputType";
import { BlockSubscriptInput } from "../block/BlockScript";
import { BlockTypeStackable, StackableBlockShape } from "../block/BlockTypeStackable";
import { raw } from "../l10n";

export class EventGreenFlagClicked extends BlockTypeStackable {

    constructor() {
        super("events_green_flag")
        this.init({
            text: raw("when flag clicked"),
            category: BlockCategory.EVENTS,
            shape: StackableBlockShape.HEAD
        });

    }
}