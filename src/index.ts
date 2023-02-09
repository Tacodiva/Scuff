
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./lib/scuff-core/",
        extensions: [
            { loader: scratch.default, path: "./lib/scuff-scratch/" }
        ]
    });

    const ScratchBlocks = scratch.ScratchBlocks;

    const script = new module.BlockScriptRoot([
        ScratchBlocks.event.flag_clicked.createInstance(),

        ScratchBlocks.control.if.createInstance({

            idk: ScratchBlocks.operator.equals.createInstance({
                test: ScratchBlocks.operator.add.createInstance()
            }),
            testI: new module.BlockScriptInput([
                ScratchBlocks.motion.move_steps.createInstance(),

                ScratchBlocks.control.if.createInstance(),
                ScratchBlocks.control.forever.createInstance()
            ])
        }),

        ScratchBlocks.motion.move_steps.createInstance({
            test: ScratchBlocks.operator.add.createInstance({
                test: ScratchBlocks.operator.add.createInstance({
                }),
                testII: ScratchBlocks.operator.add.createInstance(),
            }),
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
    ]);

    document.getElementById("scuff-loading")?.remove();
    core.main(script);
});