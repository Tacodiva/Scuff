import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrElementScript } from "./ScuffrElementScript";

export class ScuffrElementScriptRoot extends ScuffrElementScript<BlockScriptRoot> {

    public readonly parent: ScuffrWorkspace;
    public get isSubscript(): boolean { return false; }

    public constructor(workspace: ScuffrWorkspace, script: BlockScriptRoot | null, blocks?: ScuffrElementBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptRoot(ScuffrElementScript.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(workspace.svgScriptContainer, null, workspace, script, blocks);
        this.parent = workspace;
        if (!blocks) {
            this.translationSelf = script.translation;
            this.updateTranslation();
        }
    }

    public override getRoot(): ScuffrElementScriptRoot {
        return this;
    }

    public override updateTranslation(propgrateDown?: boolean) {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTranslation(propgrateDown);
    }

    public toRootScript(): ScuffrElementScriptRoot {
        return this;
    }
}
