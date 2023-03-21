import { BlockScriptRoot } from "../block/BlockScriptRoot";
import { ScuffrSvgScript } from "./ScuffrSvgScript";
import { ScuffrCmdScriptSelectRoot } from "./commands/ScuffrCmdScriptSelectRoot";

import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrRootReference } from "./ScuffrReference";
import { ScuffrInteractionDragScript } from "./interactions/ScuffrInteractionDragScript";
import type { ScuffrReferenceBlock } from "./ScuffrReferenceTypes";
import { ScuffrSvgBlockInstance } from "./ScuffrSvgBlockInstance";
import type { ScuffrSvgScriptInput } from "./ScuffrSvgScriptInput";
import type { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";

export class ScuffrSvgScriptRoot extends ScuffrSvgScript<BlockScriptRoot> {
    public readonly parent: ScuffrElementScriptContainer;
    public get isSubscript(): boolean { return false; }

    public constructor(scriptContainer: ScuffrElementScriptContainer, script: BlockScriptRoot | null, blocks?: ScuffrSvgBlock[], translation?: Vec2) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptRoot(ScuffrSvgScript.getBlockInstanceElements(blocks).map(inst => inst.block));
            if (translation) script.translation = translation;
        }
        super(scriptContainer.scriptsDom, null, scriptContainer, script, script ? script.translation : translation);
        this.parent = scriptContainer;
        this._init(blocks);
    }

    // TODO Rename 'root' to 'scriptRoot'
    // Rename 'scriptContainer' to 'root'
    public override getRoot(): ScuffrSvgScriptRoot {
        return this;
    }

    public getReference(): ScuffrRootReference {
        return this.scriptContainer.getScriptReference(this);
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

    public getWrapperInput(checkEmpty: boolean = true): ScuffrSvgScriptInput | null {
        const firstChild = this.children[0];
        if (!(firstChild instanceof ScuffrSvgBlockInstance))
            return null;
        return firstChild.getWrapperInput(checkEmpty);
    }
}
