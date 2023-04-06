import type { BlockType } from "../../block";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrEditorPalette } from "../ScuffrEditorPalette";
import type { ScuffrSvgElement } from "../svg/ScuffrSvgElement";
import type { ScuffrBlockPaletteItem } from "./ScuffrBlockPaletteItem";

export class ScuffrBlockPaletteItemBlock implements ScuffrBlockPaletteItem {

    public readonly blockType: BlockType;

    public constructor(type: BlockType) {
        this.blockType = type;
    }

    public render(editor: ScuffrEditorPalette, translation: Vec2): ScuffrSvgElement {
        return editor.appendPaletteBlock(this.blockType, translation);
    }
}