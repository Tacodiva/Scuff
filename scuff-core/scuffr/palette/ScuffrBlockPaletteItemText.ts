import type { BlockType } from "../../block";
import type { l10nString } from "../../l10n";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrEditorPalette } from "../ScuffrEditorPalette";
import type { ScuffrSvgElement } from "../svg/ScuffrSvgElement";
import { ScuffrSvgText } from "../svg/ScuffrSvgText";
import type { ScuffrBlockPaletteItem } from "./ScuffrBlockPaletteItem";

export class ScuffrBlockPaletteItemText implements ScuffrBlockPaletteItem {

    public readonly text: l10nString;

    public constructor(text: l10nString) {
        this.text = text;
    }

    public render(editor: ScuffrEditorPalette, translation: Vec2): ScuffrSvgElement {
        const ele = new ScuffrSvgText(editor, this.text.str, editor.scriptContainer);
        ele.update(false);
        ele.translationParent = { x: translation.x, y: translation.y - ele.dimensions.y / 2 };
        ele.updateTranslation();
        editor.children.push(ele);
        return ele;
    }
}