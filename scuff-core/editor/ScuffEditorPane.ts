import type { Vec2 } from "../utils/Vec2";
import type { ScuffEditor } from "./ScuffEditor";

export type ScuffEditorPaneInfo
    = { editor: ScuffEditor, parent: ScuffEditorPane | null, target: HTMLDivElement };

export type ScuffEditorPaneFactory<TPane extends ScuffEditorPane = ScuffEditorPane>
    = (pane: ScuffEditorPaneInfo) => TPane;

    export abstract class ScuffEditorPane {

    public readonly parent: ScuffEditorPane | null;
    public readonly target: HTMLDivElement;
    public readonly editor: ScuffEditor;

    protected _dimensions: Vec2;

    public constructor({ editor, parent, target }: ScuffEditorPaneInfo) {
        this.parent = parent;
        this.target = target;
        this.editor = editor;
        this._dimensions = { x: 0, y: 0 };
    }

    public get dimensions() { return this._dimensions };

    public setDimensions(dimensions: Vec2) {
        if (this._dimensions.x !== dimensions.x || this._dimensions.y !== dimensions.y) {
            this._dimensions = dimensions;
            this.onDimensionUpdate()
        }
    }

    public onDestroy(): void { }
    public onDimensionUpdate() { }
}