import type { SvelteComponent } from "svelte";
import type { BlockScripts } from "../block";
import ScrollbarComponent from "../editor/scrollbar/ScrollbarComponent.svelte";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "../editor/ScuffEditorPane";
import type { ScuffrBlockPalette } from "./palette/ScuffrBlockPalette";
import { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";

export type BackgroundPattern = new (_: { target: Element }) => SvelteComponent;

export class ScuffrEditorPane extends ScuffEditorPane {

    public static create(scripts: BlockScripts, backgroundPattern: BackgroundPattern, palette?: ScuffrBlockPalette): ScuffEditorPaneFactory {
        return pane => new ScuffrEditorPane(pane, scripts, backgroundPattern, palette);
    }

    public readonly scripts: BlockScripts;
    public readonly workspace: ScuffrEditorWorkspace;
    public readonly BackgroundPattern: BackgroundPattern;
    public readonly palette: ScuffrBlockPalette | null;

    private constructor(pane: ScuffEditorPaneInfo, scripts: BlockScripts, backgroundPattern: BackgroundPattern, palette?: ScuffrBlockPalette) {
        super(pane);
        this.scripts = scripts;
        this.BackgroundPattern = backgroundPattern;
        this.palette = palette ?? null;

        const workspaceDom = this.target.appendChild(document.createElementNS(SVG_NS, "svg"));
        workspaceDom.classList.add("scuffr-workspace");

        this.workspace = new ScuffrEditorWorkspace(this, workspaceDom);
        this.workspace.addListeners();

        new ScrollbarComponent({ target: this.target, props: { pane: this.workspace.scriptContainer.scrollPane } })

        this._minSize = { x: 200, y: 200 };
    }

    public override onBoundsUpdate(): void {
        this.workspace.onBoundsUpdate();
    }

    public override onDestroy(): void {
        this.workspace.removeListeners();
    }
}