import type { BlockType } from "../../block";
import type { ScuffrBlockPaletteItem } from "./ScuffrBlockPaletteItem";

export class ScuffrBlockPaletteItemBlock implements ScuffrBlockPaletteItem {

    public readonly blockType: BlockType;

    public constructor(type: BlockType) {
        this.blockType = type;
    }

}