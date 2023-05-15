import { Bounds, type MutVec2 } from "@scuff/core";
import type { ScuffEditor } from "../ScuffEditor";

export type ScuffEditorPaneInfo
    = { editor: ScuffEditor, parent: ScuffEditorPane | null, target: HTMLDivElement };

export type ScuffEditorPaneFactory<TPane extends ScuffEditorPane = ScuffEditorPane>
    = (pane: ScuffEditorPaneInfo) => TPane;

export abstract class ScuffEditorPane {

    public readonly parent: ScuffEditorPane | null;
    public readonly target: HTMLDivElement;
    public readonly editor: ScuffEditor;

    protected _bounds: Bounds;
    protected _minSize: MutVec2;

    public constructor({ editor, parent, target }: ScuffEditorPaneInfo) {
        this.parent = parent;
        this.target = target;
        this.editor = editor;
        this._bounds = Bounds.Zero;
        this._minSize = { x: 0, y: 0 };
    }

    public get bounds() { return this._bounds };
    public get minSize() { return this._minSize };

    public setBounds(bounds: Bounds) {
        if (!Bounds.equal(this._bounds, bounds)) {
            this._bounds = bounds;
            this.onBoundsUpdate()
        }
    }

    public onDestroy(): void { }
    public onBoundsUpdate() { }
}