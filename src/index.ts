
import("scuff").then(module => {

    module.load({
        path: "./lib/scuff-core/",
        extensions: [
            "./lib/scuff-scratch/scuff-scratch.mjs"
        ]
    }).then(core => {
        document.getElementById("scuff-loading")?.remove();
        core.main();
    });

});