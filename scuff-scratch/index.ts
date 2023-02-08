import { ScuffCore, ScuffExtension, ScuffExtensionLoader } from "scuff";
import { ScuffScratch } from "ScuffScratch";

const extLoader: ScuffExtensionLoader = {
    id: ScuffScratch.id,

    styles: [
        "scuff-scratch.css"
    ],

    load(core: ScuffCore): ScuffExtension {
        return new ScuffScratch(core);
    },

};

export default extLoader;