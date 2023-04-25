import { BlockScriptInput, BlockScriptRoot, BlockWorkspace, ScuffEditor, ScuffEditorDefaultComponent, ScuffEditorInfoComponent, ScuffEditorPaneMonaco, ScuffEditorPaneSplit, ScuffEditorPaneSvelte, ScuffProject, ScuffrEditorPane, Target, TargetComponentBlockWorkspace, WorkspaceBackgroundCompnent } from "scuff";
import { ScratchBlocks } from "../blocks";
import { ScratchPalette } from "../palette";
import { EditorPaneProject } from "../vm/editor/EditorPaneProject";
import { EXT } from "../ScuffScratch";
import { ScuffScratchProject } from "./ScuffScratchProject";

export class ScratchEditor {

    public constructor(project: ScuffScratchProject) {
        document.body.classList.add("scuff-theme-default");
        if (location.href.includes("light"))
            document.body.classList.add("scuff-theme-light");
        if (location.href.includes("contrast"))
            document.body.classList.add("scuff-theme-contrast-blocks");
        if (location.href.includes("bold"))
            document.body.classList.add("scuff-theme-bold");
        if (location.href.includes("neon"))
            document.body.classList.add("scuff-theme-neon");


        new ScuffEditor(EXT.scuff, document.body,
            ScuffEditorPaneSplit.createHorizontal(
                ScuffrEditorPane.create(project.stage.blocks, WorkspaceBackgroundCompnent, ScratchPalette),
                ScuffEditorPaneSplit.createVertical(
                    EditorPaneProject.create(),
                    ScuffEditorPaneSvelte.create([ScuffEditorInfoComponent]),
                    // ScuffEditorPaneMonaco.create(),
                    0.01
                ),
                0.99
                // ScuffrEditorPane.create(targetR.blockScripts, WorkspaceBackgroundCompnent, ScratchPalette)
            )
        );
    }
}