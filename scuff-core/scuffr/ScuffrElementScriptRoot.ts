import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrElementScript } from "./ScuffrElementScript";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrReference } from "./ScuffrReference";

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

    public getReference(): ScuffrReference<ScuffrElementScriptRoot> {
        return this.workspace.getScriptReference(this);
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
