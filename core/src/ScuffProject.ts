import type { Target } from "./target/Target";
import { SimpleEvent } from "./utils/SimpleEvent";

export class ScuffProject {

    private _targets: Target[];
    public get targets(): readonly Target[] { return this._targets; }

    public eventTargetsChanged: SimpleEvent<[operation: "add" | "remove", target: Target]>;

    public constructor() {
        this._targets = [];
        this.eventTargetsChanged = new SimpleEvent();
    }

    public addTarget(target: Target, event: boolean = true): Target {
        this._targets.push(target);
        if (event) this.eventTargetsChanged.emit("add", target);
        return target;
    }
}