import { ScuffCore, ScuffExtension } from "../public/lib/scuff-core/scuff-core";

export class ScuffScratch implements ScuffExtension {

    public static readonly id: string = "scuff-scratch";

    public constructor(core: ScuffCore) {
        console.log("Scuff Scratch Ext Loaded!");
    }


}