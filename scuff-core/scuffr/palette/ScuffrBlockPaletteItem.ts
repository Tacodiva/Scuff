import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrEditorPalette } from "../ScuffrEditorPalette";
import type { ScuffrSvgElement } from "../svg/ScuffrSvgElement";

export interface ScuffrBlockPaletteItem {
    render(editor: ScuffrEditorPalette, translation: Vec2): ScuffrSvgElement;
}
