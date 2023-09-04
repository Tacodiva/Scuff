import type { SvelteComponent } from "svelte";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "../editor/panes/ScuffEditorPane";
import type { ScuffrBlockPalette } from "./palette/ScuffrBlockPalette";
import { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";
import type { TargetComponentBlockWorkspace } from "@scuff/core";

export type BackgroundPattern = new (_: { target: Element }) => SvelteComponent;

export class ScuffrEditorPane extends ScuffEditorPane {

    public static create(component: TargetComponentBlockWorkspace, backgroundPattern: BackgroundPattern, palette: ScuffrBlockPalette): ScuffEditorPaneFactory {
        return pane => new ScuffrEditorPane(pane, component, backgroundPattern, palette);
    }

    public readonly component: TargetComponentBlockWorkspace;
    public readonly workspace: ScuffrEditorWorkspace;
    public readonly BackgroundPattern: BackgroundPattern;
    public readonly palette: ScuffrBlockPalette;

    private constructor(pane: ScuffEditorPaneInfo, component: TargetComponentBlockWorkspace, backgroundPattern: BackgroundPattern, palette: ScuffrBlockPalette) {
        super(pane);
        this.component = component;
        this.BackgroundPattern = backgroundPattern;
        this.palette = palette;

        const workspaceDom = this.target.appendChild(document.createElementNS(SVG_NS, "svg"));
        workspaceDom.classList.add("scuffr-workspace");

        this.workspace = new ScuffrEditorWorkspace(this, workspaceDom);
        this.workspace.addListeners();

        this._minSize = { x: 200, y: 200 };
    }

    public override onBoundsUpdate(): void {
        this.workspace.onBoundsUpdate();
    }

    public override onDestroy(): void {
        this.workspace.removeListeners();
    }
}