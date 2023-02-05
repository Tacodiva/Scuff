import { BlockType } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScuffrBackground } from "../scuffr/background/ScuffrBackground";
import { BackgroundShapes } from "../scuffr/background/BackgroundShapes";

export abstract class BlockTypeBoolean extends BlockType {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(BackgroundShapes.InputTriangle, this.category.cssClass, "scuff-block");
    }

}
