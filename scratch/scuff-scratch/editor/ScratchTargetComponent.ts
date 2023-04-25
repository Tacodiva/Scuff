import { BlockWorkspace, Target, TargetComponent, TargetComponentBlockWorkspace } from "scuff";
import { SimpleEvent } from "../../../core/src/utils/SimpleEvent";
import { ScratchVariable } from "../block/ScratchVariable";

export class ScratchTargetComponent extends TargetComponent {

    public readonly name: string;

    private _variables: ScratchVariable[];
    public get variables(): readonly ScratchVariable[] { return this._variables; }
    public readonly eventVariableUpdate: SimpleEvent<[fromVM: boolean]>;

    private _lists: ScratchVariable[];
    public get lists(): readonly ScratchVariable[] { return this._lists; }
    public readonly eventListUpdate: SimpleEvent<[fromVM: boolean]>;

    public readonly blocks: TargetComponentBlockWorkspace;

    public constructor(target: Target, name: string) {
        super(target);
        this.name = name;

        this._variables = [];
        this._lists = [];

        this.blocks = target.getOrCreateComponent(TargetComponentBlockWorkspace, () => new TargetComponentBlockWorkspace(target, new BlockWorkspace()));

        this.eventVariableUpdate = new SimpleEvent();
        this.eventListUpdate = new SimpleEvent();
    }

    public override clone(cloneTarget: Target): TargetComponent {
        return new ScratchTargetComponent(cloneTarget, this.name);
    }

    public createVariable(name: string, event: boolean = true): ScratchVariable {
        const variable = new ScratchVariable(this, name);
        this._variables.push(variable);
        if (event) this.eventVariableUpdate.emit(false);
        return variable;
    }

    public createList(name: string, event: boolean = true): ScratchVariable {
        const list = new ScratchVariable(this, name);
        this._lists.push(list);
        if (event) this.eventListUpdate.emit(false);
        return list;
    }
}