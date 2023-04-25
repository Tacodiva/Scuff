import { ScuffProject, Target } from "scuff";
import { ScratchTargetComponent } from "./ScratchTargetComponent";

export class ScuffScratchProject extends ScuffProject {

    private _stage: ScratchTargetComponent;
    public get stage() { return this._stage; }
    public get stageTarget() { return this._stage.target; }

    public constructor() {
        super();
        const stageTarget = this.addTarget(new Target(this));
        this._stage = stageTarget.addComponent(new ScratchTargetComponent(stageTarget, "Stage"));
    }

}