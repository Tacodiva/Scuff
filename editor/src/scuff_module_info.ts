import type { ScuffModuleInfo } from "@scuff/core";

export const scuffModuleInfo: ScuffModuleInfo = {
    id: "scuff:editor",

    load(core) {
        console.log("Editor loaded!");
    }
};