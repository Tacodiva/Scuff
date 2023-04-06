
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./bundle/core/",
        extensions: [
            { loader: scratch.default, path: "./bundle/scratch/" }
        ]
    });

    document.getElementById("scuff-loading")?.remove();
    new scratch.ScratchEditor();
});

export { };