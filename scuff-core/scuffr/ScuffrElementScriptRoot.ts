import { BlockScriptRoot } from "../block/BlockScriptRoot";
import { ScuffrElementScript } from "./ScuffrElementScript";
import { ScuffrCmdScriptSelectRoot } from "./commands/ScuffrCmdScriptSelectRoot";

import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrRootReference } from "./ScuffrReference";
import { ScuffrInteractionDragScript } from "./interactions/ScuffrInteractionDragScript";
import type { ScuffrReferenceBlock } from "./ScuffrReferenceTypes";
import { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import type { ScuffrElementScriptInput } from "./ScuffrElementScriptInput";

export class ScuffrElementScriptRoot extends ScuffrElementScript<BlockScriptRoot> {
    public readonly parent: ScuffrWorkspace;
    public get isSubscript(): boolean { return false; }

    public constructor(workspace: ScuffrWorkspace, script: BlockScriptRoot | null, blocks?: ScuffrElementBlock[], translation?: Vec2) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptRoot(ScuffrElementScript.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
            if (translation) script.translation = translation;
        }
        super(workspace.svgScriptContainer, null, workspace, script, script ? script.translation : translation);
        this.parent = workspace;
        this._init(blocks);
    }

    public override getRoot(): ScuffrElementScriptRoot {
        return this;
    }

    public getReference(): ScuffrRootReference {
        return this.workspace.getScriptReference(this);
    }

    public override updateTranslation(propgrateDown?: boolean) {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTranslation(propgrateDown);
    }

    public override onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean {
        if (reference.index === 0) {
            this.workspace.startInteraction(new ScuffrInteractionDragScript(new ScuffrCmdScriptSelectRoot(this.getReference()), event));
            return true;
        }
        return super.onChildBlockDrag(reference, event);
    }

    public getWrapperInput(checkEmpty: boolean = true): ScuffrElementScriptInput | null {
        const firstChild = this.children[0];
        if (!(firstChild instanceof ScuffrElementBlockInstance))
            return null;
        return firstChild.getWrapperInput(checkEmpty);
    }
}
