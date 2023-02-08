import { BlockCategory } from "../../src/block/BlockCategory";
import { BlockTypeStackable, StackableBlockShape } from "../../src/block/BlockTypeStackable";
import { raw } from "../../src/l10n";


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