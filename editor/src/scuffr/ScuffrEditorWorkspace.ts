import { ScuffrEditorPalette } from "./ScuffrEditorPalette";
import type { ScuffrEditorPane } from "./ScuffrEditorPane";
import { ScuffrEditorScriptContainer } from "./ScuffrEditorScriptContainer";
import { ScuffrWorkspace } from "./ScuffrWorkspace";

export class ScuffrEditorWorkspace extends ScuffrWorkspace {
    public readonly pane: ScuffrEditorPane;

    public readonly children: readonly [
        scriptContainer: ScuffrEditorScriptContainer,
        palette: ScuffrEditorPalette
    ];
    public readonly scriptContainer: ScuffrEditorScriptContainer;
    public get palette() { return this.children[1]; }


    public constructor(pane: ScuffrEditorPane, target: SVGSVGElement) {
        super(target, pane.editor);

        this.pane = pane;

        this.children = [
            this.scriptContainer = new ScuffrEditorScriptContainer(this),
            new ScuffrEditorPalette(this)
        ];
    }

    public onBoundsUpdate() {
        const b = this.pane.bounds;
        this.scriptContainer.setBounds(b);
        this.palette.scriptContainer.setBounds({ x: b.x, y: b.y, width: 250, height: b.height });
    }
}