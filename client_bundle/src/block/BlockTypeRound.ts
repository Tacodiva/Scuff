import { BlockType } from "./BlockType";
import { ScuffrBackground, ScuffrBackgroundShape } from "../scuffr/ScuffrBackground";
import type { BlockInstance } from "./BlockInstance";

export abstract class BlockTypeRound extends BlockType {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(ScuffrBackgroundShape.ROUND_BLOCK, this.category.colorPrimary, this.category.colorTertiary);
    }

}
