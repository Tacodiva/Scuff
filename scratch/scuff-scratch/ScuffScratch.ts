import { ScuffCore, ScuffExtension } from "scuff";

export class ScuffScratch implements ScuffExtension {

    public static readonly id: string = "scuff-scratch";
    
    public readonly path: string;

    public constructor(core: ScuffCore, path: string) {
        extension = this;
        this.path = path;
    }

    public getResourcePath(resource: string) {
        return new URL(resource, this.path).href;
    }
}

export var extension: ScuffScratch = undefined!;