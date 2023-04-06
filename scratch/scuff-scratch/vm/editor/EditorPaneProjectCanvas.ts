import { ScuffEditorPane, ScuffEditorPaneFactory, ScuffEditorPaneInfo } from "scuff";

export class EditorPaneProjectCanvas extends ScuffEditorPane {

    public static create(): ScuffEditorPaneFactory {
        return pane => new EditorPaneProjectCanvas(pane);
    }

    public constructor(pane: ScuffEditorPaneInfo) {
        super(pane);
    }



}