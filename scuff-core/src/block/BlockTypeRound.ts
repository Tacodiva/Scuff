import { BlockType } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScuffrBackground } from "../scuffr/background/ScuffrBackground";
import { ScuffBackgroundShapes } from "../scuffr/background/ScuffBackgroundShapes";

export abstract class BlockTypeRound extends BlockType {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(ScuffBackgroundShapes.InputRound, this.category.cssClass, "scuff-block");
    }

}
