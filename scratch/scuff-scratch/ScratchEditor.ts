import { BlockScriptInput, BlockScriptRoot, BlockWorkspace, ScuffEditor, ScuffEditorDefaultComponent, ScuffEditorInfoComponent, ScuffEditorPaneMonaco, ScuffEditorPaneSplit, ScuffEditorPaneSvelte, ScuffProject, ScuffrEditorPane, Target, TargetComponentBlockWorkspace, WorkspaceBackgroundCompnent } from "scuff";
import { ScratchBlocks } from "./blocks";
import { ScratchPalette } from "./palette";
import { EditorPaneProject } from "./vm/editor/EditorPaneProject";
import { EXT } from "./ScuffScratch";
import { ScuffScratchProject } from "./ScuffScratchProject";

export class ScratchEditor {

    public constructor() {
        const top = ScratchBlocks.operator.add.createInstance();
        let bottom = top;

        for (let i = 0; i < 5; i++) {
            // const next = ScratchBlocks.control.forever.createInstance();
            const next = ScratchBlocks.operator.add.createInstance();
            // bottom.setInputByID("testI", new module.BlockScriptInput([next]));
            bottom.setInput(ScratchBlocks.operator.add.getInput("test")!, next);
            bottom = next;
        }

        const script = new BlockScriptRoot([
            ScratchBlocks.event.flag_clicked.createInstance(),

            ScratchBlocks.looks.say.createInstance(),
            ScratchBlocks.looks.set_effect_to.createInstance(),

            ScratchBlocks.control.if.createInstance({

                idk: ScratchBlocks.sensing.key_pressed.createInstance({
                }),
                testI: new BlockScriptInput([
                    ScratchBlocks.motion.move_steps.createInstance(),

                    ScratchBlocks.control.if.createInstance(),
                    ScratchBlocks.control.forever.createInstance()
                ])
            }),
            ScratchBlocks.control.if.createInstance({
            }),

            ScratchBlocks.motion.move_steps.createInstance({
                test: top
            }),
            ScratchBlocks.motion.move_steps.createInstance(),
            ScratchBlocks.motion.move_steps.createInstance({
                test: ScratchBlocks.operator.add.createInstance({
                    testII: ScratchBlocks.operator.equals.createInstance(),
                }),
            }),
            ScratchBlocks.motion.move_steps.createInstance({
                test: ScratchBlocks.operator.add.createInstance({}),
            }),
            ScratchBlocks.motion.move_steps.createInstance(),
            ScratchBlocks.motion.move_steps.createInstance({
                test: ScratchBlocks.operator.add.createInstance({}),
            }),
            // top
        ]);

        document.body.classList.add("scuff-theme-default");
        if (location.href.includes("light"))
            document.body.classList.add("scuff-theme-light");
        if (location.href.includes("contrast"))
            document.body.classList.add("scuff-theme-contrast-blocks");
        if (location.href.includes("bold"))
            document.body.classList.add("scuff-theme-bold");
        if (location.href.includes("neon"))
            document.body.classList.add("scuff-theme-neon");

        const project = new ScuffScratchProject();

        // const targetL = project.addTarget(new Target(project));
        const blockScriptsL = project.background.addComponent(new TargetComponentBlockWorkspace(project.background, new BlockWorkspace()));
        blockScriptsL.workspace.addScript(script.clone());
        blockScriptsL.transformScale = 1.5;
        blockScriptsL.transformPosition = { x: 300, y: 0 };

        // const targetR = project.addTarget(new Target(project));
        // const blockScriptsR = targetR.addComponent(new TargetComponentBlockWorkspace(targetR, new BlockWorkspace()));
        // blockScriptsR.workspace.addScript(script);
        // blockScriptsR.transformScale = 1.5;
        // blockScriptsR.transformPosition = { x: 500, y: 75 };

        new ScuffEditor(EXT.scuff, document.body,
            ScuffEditorPaneSplit.createHorizontal(
                ScuffrEditorPane.create(blockScriptsL, WorkspaceBackgroundCompnent, ScratchPalette),
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