import { BlockType } from "./BlockType";
import { ScruffrBackgroundShape } from "../scruffr/background/ScruffrBackgroundShape";
import type { BlockInstance } from "./BlockInstance";
import { ScruffrBackground } from "../scruffr/background";

export abstract class BlockTypeRound extends BlockType {

    public getBackground(block: BlockInstance): ScruffrBackground {
        return new ScruffrBackground(ScruffrBackgroundShape.ROUND_BLOCK, this.category.colorPrimary, this.category.colorTertiary);
    }

}
