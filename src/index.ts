
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./lib/scuff-core/",
        extensions: [
            { loader: scratch.default, path: "./lib/scuff-scratch/" }
        ]
    });

    const ScratchBlocks = scratch.ScratchBlocks;

    const top = ScratchBlocks.control.forever.createInstance();
    let bottom = top;

    for (let i = 0; i < 5; i++) {
        const next = ScratchBlocks.control.forever.createInstance();
        bottom.setInputByID("testI", new module.BlockScriptInput([next]));
        bottom = next;
    }

    bottom.setInputByID("testI", new module.BlockScriptInput([ScratchBlocks.control.if.createInstance({ testI: new module.BlockScriptInput([ScratchBlocks.motion.move_steps.createInstance()]) })]));


    const script = new module.BlockScriptRoot([
        ScratchBlocks.event.flag_clicked.createInstance(),

        ScratchBlocks.control.if.createInstance({

            idk: ScratchBlocks.operator.equals.createInstance({
                // test: ScratchBlocks.operator.add.createInstance()
            }),
            testI: new module.BlockScriptInput([
                ScratchBlocks.motion.move_steps.createInstance(),

                ScratchBlocks.control.if.createInstance(),
                ScratchBlocks.control.forever.createInstance()
            ])
        }),
        ScratchBlocks.control.if.createInstance({
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
        // top
    ]);

    document.getElementById("scuff-loading")?.remove();
    core.main(script);
});