import { ScuffrEditorPaletteScriptContainer } from "./ScuffrEditorPaletteScriptContainer";
import type { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";

export class ScuffrEditorPalette extends ScuffrElement<SVGGElement> implements ScuffrElementParent {

    public readonly parent: ScuffrEditorWorkspace;
    public children: ScuffrElement[];
    public readonly scriptContainer: ScuffrEditorPaletteScriptContainer;

    public constructor(workspace: ScuffrEditorWorkspace) {
        super(workspace.dom.appendChild(document.createElementNS(SVG_NS, "g")), workspace);

        this.parent = workspace;
        this.children = [this.scriptContainer = new ScuffrEditorPaletteScriptContainer(this)];

        let y = 40;

        for (const category of this.parent.pane.palette.getCategories()) {
            for (const item of category.getItems()) {
                const element = item.render(this, { x: 10, y });
                y += element.dimensions.y + 10;
            }
        }
    }
}