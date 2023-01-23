import { BlockType } from "./BlockType";
import { ScruffrBackgroundShape } from "../scruffr/background/ScruffrBackgroundShape";
import type { BlockInstance } from "./BlockInstance";
import { ScruffrBackground } from "../scruffr/background";

export abstract class BlockTypeBoolean extends BlockType {

    public getBackground(block: BlockInstance): ScruffrBackground {
        return new ScruffrBackground(ScruffrBackgroundShape.TRIANGLE_BLOCK, this.category.colorPrimary, this.category.colorTertiary);
    }

}
