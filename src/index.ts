
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./lib/scuff-core/",
        extensions: [
            { loader: scratch.default, path: "./lib/scuff-scratch/" }
        ]
    });

    document.getElementById("scuff-loading")?.remove();
    new scratch.ScratchEditor();
});

export { };