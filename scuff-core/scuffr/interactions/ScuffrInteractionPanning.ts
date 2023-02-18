import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";

export class ScuffrInteractionPanning extends ScuffrInteraction {
    public readonly startTransform: Vec2;
    public readonly startPos: Vec2;

    constructor(workspace: ScuffrWorkspace, startPos: Vec2) {
        super(workspace);
        this.startPos = startPos;
        this.startTransform = workspace.blockScripts.transformPosition;
    }

    public override onMouseMove(event: MouseEvent): void {
        this.workspace.blockScripts.transformPosition = {
            x: this.startTransform.x +
                (event.x - this.startPos.x) / this.workspace.blockScripts.transformScale,
            y: this.startTransform.y +
                (event.y - this.startPos.y) / this.workspace.blockScripts.transformScale,
        };
        this.workspace.updateGlobalTransform();
    }
}
