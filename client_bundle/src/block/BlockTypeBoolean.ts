import { BlockType } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScruffrBackground } from "../scruffr/background";
import { BackgroundShapes } from "../scruffr/background/BackgroundShapes";

export abstract class BlockTypeBoolean extends BlockType {

    public getBackground(block: BlockInstance): ScruffrBackground {
        return new ScruffrBackground(BackgroundShapes.InputTriangle, this.category.colorPrimary, this.category.colorTertiary);
    }

}
