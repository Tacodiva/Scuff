import { ScratchTargetComponent } from "../editor/ScratchTargetComponent";

export class ScratchVariable {

    public readonly target: ScratchTargetComponent;

    private _name: string;
    public get name() { return this._name; }

    public constructor(target: ScratchTargetComponent, name: string) {
        this.target = target;
        this._name = name;
    }

    public setName(name: string, event: boolean = true) {
        this._name = name;
        if (event)
            this.target.eventVariableUpdate.emit(false);
    }
}