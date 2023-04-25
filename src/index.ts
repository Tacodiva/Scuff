
import("scuff").then(async module => {

    const scratch = await import("scuff-scratch");

    const core = await module.load({
        path: "./bundle/core/",
        extensions: [
            { loader: scratch.default, path: "./bundle/scratch/" }
        ]
    });

    new scratch.ScratchEditor((window as any).project = await scratch.loadProject(839655537));
    document.getElementById("scuff-loading")?.remove();
});

export { };