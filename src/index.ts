import { ScuffLoader } from "../public/lib/scuff-core/scuff-core";

requirejs(["lib/scuff-core/scuff-core.js"], (scuffLoader: ScuffLoader) => {
    scuffLoader.load({
        extensions: [
            "lib/scuff-scratch/scuff-scratch.js"
        ]
    }).then(async core => {
        document.getElementById("scuff-loading")?.remove();
        core.main();
    });
}, (err: any) => {
    console.log(err);
});
