
import * as ScuffCore from "@scuff/core";
import * as ScuffEditor from "@scuff/editor";
import * as ScuffScratch from "@scuff/scratch";

import '../../node_modules/@scuff/editor/dist/esm/style.css';

ScuffCore.load({
    modules: [
        ScuffScratch,
        ScuffEditor
    ]
}).then(core => {
    document.getElementById("scuff-loading")?.remove();

    document.body.classList.add("scuff-theme-default");
    if (location.href.includes("light"))
        document.body.classList.add("scuff-theme-light");
    if (location.href.includes("contrast"))
        document.body.classList.add("scuff-theme-contrast-blocks");
    if (location.href.includes("bold"))
        document.body.classList.add("scuff-theme-bold");
    if (location.href.includes("neon"))
        document.body.classList.add("scuff-theme-neon");

    new ScuffEditor.ScuffEditor(document.body,
        ScuffEditor.ScuffEditorPaneSplit.createVertical(
            ScuffEditor.ScuffEditorPaneSvelte.create([ScuffEditor.ScuffEditorDefaultComponent]),
            ScuffEditor.ScuffEditorPaneSvelte.create([ScuffEditor.ScuffEditorInfoComponent, { core }])
        )
    )
});