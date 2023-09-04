import type monaco from "monaco-editor-types";
import ScuffEditorLoadingComponent from "../ScuffEditorLoadingComponent.svelte";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "../ScuffEditorPane";
import MONACO from "./load";
import type { Bounds } from "@scuff/core";

export class ScuffEditorPaneMonaco extends ScuffEditorPane {

    public static create(): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneMonaco(pane);
    }

    private monaco: MonacoAPI | null;
    private monacoEditor: monaco.editor.IStandaloneCodeEditor | null;

    public constructor(pane: ScuffEditorPaneInfo) {
        super(pane);
        this.monaco = null;
        this.monacoEditor = null;
        new ScuffEditorLoadingComponent({ target: this.target });
        MONACO.then(this._onMonacoLoad);
    }

    private _onMonacoLoad = (monaco: MonacoAPI) => {
        this.monaco = monaco;
        this.target.children[0].remove();
        this.monacoEditor = this.monaco.editor.create(this.target, {
            value: "\nconsole.log('Hello, World!');",
            language: "javascript",
            theme: "vs-dark"
        })
    }

    public override setBounds(bounds: Bounds): void {
        super.setBounds(bounds);
        if (this.monacoEditor) this.monacoEditor.layout(bounds);
    }

}