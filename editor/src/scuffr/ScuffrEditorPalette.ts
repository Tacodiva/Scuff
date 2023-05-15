import type { BlockType, Vec2 } from "@scuff/core";
import { ScuffrEditorPalletteElementContainer } from "./ScuffrEditorPaletteElementContainer";
import { ScuffrEditorPaletteScriptContainer } from "./ScuffrEditorPaletteScriptContainer";
import type { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrSvgElement } from "./svg/ScuffrSvgElement";
import type { ScuffrSvgScriptPalette } from "./svg/ScuffrSvgScriptPalette";

export class ScuffrEditorPalette extends ScuffrElement<SVGGElement> implements ScuffrElementParent {

    public readonly parent: ScuffrEditorWorkspace;
    public children: [ScuffrEditorPaletteScriptContainer, ScuffrEditorPalletteElementContainer];
    public readonly scriptContainer: ScuffrEditorPaletteScriptContainer;
    public readonly elementContainer: ScuffrEditorPalletteElementContainer;

    public constructor(workspace: ScuffrEditorWorkspace) {
        super(workspace.dom.appendChild(document.createElementNS(SVG_NS, "g")), workspace);

        this.parent = workspace;
        this.children = [
            this.scriptContainer = new ScuffrEditorPaletteScriptContainer(this),
            this.elementContainer = new ScuffrEditorPalletteElementContainer(this),
        ];

        let y = 32;
        for (const category of this.parent.pane.palette.getCategories()) {
            for (const item of category.getItems()) {
                const element = item.render(this, { x: 10, y });
                y += element.dimensions.y + 10;
            }
        }
        this.scriptContainer.contentTranslation.y = 0;
        this.scriptContainer.updateScrollPane();
    }

    public appendPaletteBlock(type: BlockType, translation: Vec2): ScuffrSvgScriptPalette {
        return this.scriptContainer.appendPaletteBlock(type, translation);
    }

    public appendElement<T extends ScuffrSvgElement>(element: T): T {
        return this.elementContainer.appendElement(element);
    }
}