import { ScuffCore, ScuffExtension } from "scuff";
import sandboxCode from '../sandbox.js.txt';

export class ScuffScratch implements ScuffExtension {
    
    public static readonly id: string = "scuff-scratch";
    
    public constructor(core: ScuffCore) {
        console.log("Scuff Scratch Ext Loaded!");
        console.log(sandboxCode);
    }


}