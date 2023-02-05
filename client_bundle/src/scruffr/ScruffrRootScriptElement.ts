import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { IScruffrBlock } from "./IScruffrBlock";
import { ScruffrScriptElement } from "./ScruffrScriptElement";
import type { ScruffrWorkspace } from "./ScruffrWorkspace";

export class ScruffrRootScriptElement extends ScruffrScriptElement<BlockScriptRoot> {

    public readonly parent: ScruffrWorkspace;

    public constructor(workspace: ScruffrWorkspace, script: BlockScriptRoot | null, blocks?: IScruffrBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptRoot(ScruffrScriptElement.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(workspace.svgScriptContainer, null, workspace, script, blocks);
        this.parent = workspace;
        this.translationSelf = script.translation;
    }

    public override getRoot(): ScruffrRootScriptElement {
        return this;
    }

    public override updateTraslation() {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTraslation();
    }

    public toRootScript(): ScruffrRootScriptElement {
        return this;
    }
}
