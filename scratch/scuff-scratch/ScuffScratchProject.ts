import { ScuffProject, Target } from "scuff";

export class ScuffScratchProject extends ScuffProject {

    private _background: Target;
    public get background() { return this._background; }

    public constructor() {
        super();
        this._background = this.addTarget(new Target(this));
    }

}