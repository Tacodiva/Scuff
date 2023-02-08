import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { IScuffrBlock } from "./IScuffrBlock";
import { ScuffrScriptElement } from "./ScuffrScriptElement";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";

export class ScuffrRootScriptElement extends ScuffrScriptElement<BlockScriptRoot> {

    public readonly parent: ScuffrWorkspace;
    public get isSubscript(): boolean { return true; }

    public constructor(workspace: ScuffrWorkspace, script: BlockScriptRoot | null, blocks?: IScuffrBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptRoot(ScuffrScriptElement.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(workspace.svgScriptContainer, null, workspace, script, blocks);
        this.parent = workspace;
        this.translationSelf = script.translation;
    }

    public override getRoot(): ScuffrRootScriptElement {
        return this;
    }

    public override updateTraslation() {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTraslation();
    }

    public toRootScript(): ScuffrRootScriptElement {
        return this;
    }
}
