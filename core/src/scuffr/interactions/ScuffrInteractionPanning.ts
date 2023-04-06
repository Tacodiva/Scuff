import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";

export class ScuffrInteractionPanning extends ScuffrInteraction {
    public readonly startTransform: Vec2;
    public readonly startPos: Vec2;

    constructor(root: ScuffrElementScriptContainer, startPos: Vec2) {
        super(root);
        this.startPos = startPos;
        this.startTransform = root.contentTranslation;
    }

    public override onMouseMove(event: MouseEvent): void {
        this.root.contentTranslation = {
            x: this.startTransform.x +
                (event.x - this.startPos.x) / this.root.contentScale,
            y: this.startTransform.y +
                (event.y - this.startPos.y) / this.root.contentScale,
        };
        this.root.updateContentTransform();
    }
}
