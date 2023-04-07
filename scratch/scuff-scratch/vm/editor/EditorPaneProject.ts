import { ScuffEditorPane, ScuffEditorPaneFactory, ScuffEditorPaneInfo } from "scuff";
import { ProjectIFrame } from "../ProjectIFrame";

export class EditorPaneProject extends ScuffEditorPane {

    public static create(): ScuffEditorPaneFactory {
        return pane => new EditorPaneProject(pane);
    }

    public readonly project: ProjectIFrame;

    public constructor(pane: ScuffEditorPaneInfo) {
        super(pane);
        this.project = new ProjectIFrame(this.target);
        this._minSize = {x: 480, y: 360};
    }



}