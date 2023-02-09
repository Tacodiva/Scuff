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
        this.translationSelf = script.translation;
    }

    public override getRoot(): ScuffrElementScriptRoot {
        return this;
    }

    public override updateTraslation() {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTraslation();
    }

    public toRootScript(): ScuffrElementScriptRoot {
        return this;
    }
}
