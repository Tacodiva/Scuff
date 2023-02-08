import { ScuffCore, ScuffExtension } from "../public/lib/scuff-core/scuff-core";

const ext: ScuffExtension = {

    init(core: ScuffCore) {
        console.log("Scratch EXT Initalized!");
    },

};

export default ext;