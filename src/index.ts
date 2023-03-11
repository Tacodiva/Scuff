
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./lib/scuff-core/",
        extensions: [
            { loader: scratch.default, path: "./lib/scuff-scratch/" }
        ]
    });

    const ScratchBlocks = scratch.ScratchBlocks;

    const top = ScratchBlocks.operator.add.createInstance();
    let bottom = top;

    for (let i = 0; i < 5; i++) {
        // const next = ScratchBlocks.control.forever.createInstance();
        const next = ScratchBlocks.operator.add.createInstance();
        // bottom.setInputByID("testI", new module.BlockScriptInput([next]));
        bottom.setInput(ScratchBlocks.operator.add.getInput("test")!, next);
        bottom = next;
    }

    // bottom.setInputByID("testI", new module.BlockScriptInput([ScratchBlocks.control.if.createInstance({ testI: new module.BlockScriptInput([ScratchBlocks.motion.move_steps.createInstance()]) })]));


    const script = new module.BlockScriptRoot([
        ScratchBlocks.event.flag_clicked.createInstance(),

        ScratchBlocks.looks.say.createInstance(),
        ScratchBlocks.looks.set_effect_to.createInstance(),

        ScratchBlocks.control.if.createInstance({

            idk: ScratchBlocks.sensing.key_pressed.createInstance({
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

    document.getElementById("scuff-loading")?.remove();
    core.main(script);
});