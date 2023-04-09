import type { Target } from "./Target";

export abstract class TargetComponent {

    public readonly target: Target;

    public constructor(target: Target) {
        this.target = target;
    }

    public abstract clone(cloneTarget: Target): TargetComponent;
}