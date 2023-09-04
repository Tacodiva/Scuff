import { ScuffModuleInfo } from "@scuff/core";

export const scuffModuleInfo: ScuffModuleInfo = {
    id: "scuff:scratch",

    async load(core) {
        console.log("Scratch loaded!");
        
        
        console.log(await core.getModuleAsync("scuff:editor"));
    }
};