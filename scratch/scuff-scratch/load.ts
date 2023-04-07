import { ScuffCore, ScuffExtension, ScuffExtensionLoader } from "scuff";
import { ScuffScratch } from "./ScuffScratch";

export const ScratchExtLoader: ScuffExtensionLoader = {
    id: ScuffScratch.id,

    styles: [
        "scuff-scratch.css"
    ],

    async load(core: ScuffCore): Promise<ScuffExtension> {
        return new ScuffScratch(core, this.path!);
    }
};