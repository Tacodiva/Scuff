import { BlockType } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScuffrBackground } from "../scuffr/background/ScuffrBackground";
import { BackgroundShapes } from "../scuffr/background/BackgroundShapes";

export abstract class BlockTypeRound extends BlockType {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(BackgroundShapes.InputRound, this.category.cssClass, "scuff-block");
    }

}
