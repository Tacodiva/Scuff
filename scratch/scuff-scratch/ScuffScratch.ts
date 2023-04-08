import { ScuffCore, ScuffExtension } from "scuff";

export class ScuffScratch implements ScuffExtension {

    public static readonly id: string = "scuff-scratch";

    public readonly scuff: ScuffCore;
    
    /**
     * The location of the folder containing the scuff-scratch.mjs file.
     * Used for getting the location of other resources located next to this file.
     */
    public readonly path: string;

    public constructor(scuff: ScuffCore, path: string) {
        EXT = this;
        this.path = path;
        this.scuff = scuff;
    }

    /**
     * Get the path of a resource located in the same folder as the scuff-scratch.mjs file.
     */
    public getResourcePath(resource: string) {
        return new URL(resource, this.path).href;
    }
}

export var EXT: ScuffScratch = undefined!;