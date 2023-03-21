import type { ScuffrEditorPane } from "./ScuffrEditorPane";
import { ScuffrEditorScriptContainer } from "./ScuffrEditorScriptContainer";
import { ScuffrWorkspace } from "./ScuffrWorkspace";

export class ScuffrEditorWorkspace extends ScuffrWorkspace {
    public readonly pane: ScuffrEditorPane;

    public readonly children: readonly [
        scriptContainer: ScuffrEditorScriptContainer
    ];
    public get scriptContainer() { return this.children[0]; }


    public constructor(pane: ScuffrEditorPane, target: SVGSVGElement) {
        super(target);

        this.pane = pane;
        this.children = [
            new ScuffrEditorScriptContainer(this)
        ];
    }

    public onBoundsUpdate() {
        this.scriptContainer.setBounds(this.pane.bounds);
    }
}