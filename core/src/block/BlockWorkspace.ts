import type { BlockScript } from "./BlockScript";
import type { BlockScriptRoot } from "./BlockScriptRoot";

export class BlockWorkspace {

    private _scripts: BlockScriptRoot[];
    public get scripts(): readonly BlockScriptRoot[] { return this._scripts; }

    public constructor(scripts: BlockScriptRoot[] = []) {
        this._scripts = scripts;
    }

    public addScript(script: BlockScriptRoot) {
        this._scripts.push(script);
    }

    public deleteScript(script: BlockScriptRoot) {
        const index = this._scripts.indexOf(script);
        if (index === -1) throw new Error("Script not present in workspace.");
        this._scripts.splice(index, 1);
    }
}