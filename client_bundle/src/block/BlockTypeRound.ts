import { BlockType } from "./BlockType";
import { ScruffrBackground, ScruffrBackgroundShape } from "../scruffr/ScruffrBackground";
import type { BlockInstance } from "./BlockInstance";

export abstract class BlockTypeRound extends BlockType {

    public getBackground(block: BlockInstance): ScruffrBackground {
        return new ScruffrBackground(ScruffrBackgroundShape.ROUND_BLOCK, this.category.colorPrimary, this.category.colorTertiary);
    }

}
