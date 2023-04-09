import type { Vec2 } from "../utils/Vec2";
import { TargetComponent } from "./TargetComponent";
import type { Target } from "./Target";
import type { BlockWorkspace } from "../block/BlockWorkspace";

export class TargetComponentBlockWorkspace extends TargetComponent {

    public workspace: BlockWorkspace;

    public transformPosition: Vec2;
    public transformScale: number;

    public constructor(target: Target, workspace: BlockWorkspace) {
        super(target);
        this.workspace = workspace;
        this.transformPosition = { x: 0, y: 0 };
        this.transformScale = 1;
    }

    public override clone(cloneTarget: Target): TargetComponentBlockWorkspace {
        return new TargetComponentBlockWorkspace(cloneTarget, this.workspace);
    }
}