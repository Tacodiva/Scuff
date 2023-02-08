import { BlockType } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScuffrBackground } from "../scuffr/background/ScuffrBackground";
import { ScuffBackgroundShapes } from "../scuffr/background/ScuffBackgroundShapes";

export abstract class BlockTypeBoolean extends BlockType {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(ScuffBackgroundShapes.InputTriangle, this.category.cssClass, "scuff-block");
    }

}
