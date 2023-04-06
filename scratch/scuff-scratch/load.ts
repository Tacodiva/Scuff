import { ScuffCore, ScuffExtension, ScuffExtensionLoader } from "scuff";
import { ScuffScratch } from "./ScuffScratch";
import loadLLK from "./vm/llk/load";
import LLK from "./vm/llk";

export const ScratchExtLoader: ScuffExtensionLoader = {
    id: ScuffScratch.id,

    styles: [
        "scuff-scratch.css"
    ],

    async load(core: ScuffCore): Promise<ScuffExtension> {
        await loadLLK(this.path!);
        console.log(LLK);
        return new ScuffScratch(core);
    }
};