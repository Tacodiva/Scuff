import type { ScuffrRootReference } from "..";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";

export class ScuffrCmdScriptSelectRoot implements ScuffrCmdScriptSelect {

    public readonly source: ScuffrRootReference;
    public get workspace() { return this.source.parent; }

    public readonly sourcePosition: Vec2;
    public targetPosition: Vec2;

    public constructor(target: ScuffrRootReference, targetPosition?: Vec2) {
        this.source = target;
        this.sourcePosition = { ...this.workspace.getScript(target.index).translationSelf };
        this.targetPosition = targetPosition ?? this.sourcePosition;
    }

    public do(): void {
        this.workspace.swapSelected(this.source.index);
        const script = this.workspace.getSelectedScript();
        script.translationSelf = { ...this.targetPosition };
        script.updateTranslation();
    }

    public undo(): void {
        const script = this.workspace.getSelectedScript();
        script.translationSelf = { ...this.sourcePosition };
        script.updateTranslation();
        this.workspace.swapSelected(this.source.index);
    }
}