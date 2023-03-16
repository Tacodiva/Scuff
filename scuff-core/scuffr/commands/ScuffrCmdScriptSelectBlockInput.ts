import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementBlock } from "../ScuffrElementBlock";
import { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import type { ScuffrElementInput } from "../ScuffrElementInput";
import { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrLinkReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrReferenceBlock } from "../ScuffrReferenceTypes";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";

export class ScuffrCmdScriptSelectBlockInput implements ScuffrCmdScriptSelect {
    public source: ScuffrReferenceChain<ScuffrElementInput | ScuffrElementBlock>;
    public get workspace() { return this.source.workspace; }

    public targetPosition: Vec2;

    public constructor(source: ScuffrReferenceBlock, position: Vec2) {
        this.source = new ScuffrReferenceChain<ScuffrElementInput | ScuffrElementBlock>(source);
        this.targetPosition = position;
    }

    private _getSourceReference(): ScuffrLinkReference<ScuffrElementInput, ScuffrElementBlockInstance> {
        const reference = this.source.getTerminalReference();
        if (!(reference.parent instanceof ScuffrElementBlockInstance))
            throw new Error("ScuffrCommandBlockDetachBlock only valid for block instance children.");
        return reference as any;
    }

    public do() {
        const source = this._getSourceReference();
        const block = source.parent.content.detachBlock(source.index);
        const script = new ScuffrElementScriptRoot(this.workspace, null, [block], this.targetPosition);
        this.workspace.addRenderedScript(script);
    }

    public undo() {
        const source = this._getSourceReference();
        const script = this.workspace.getSelectedScript();
        source.parent.content.setInputByIndex(source.index, script.children[0] as ScuffrElementBlockInstance);
        this.workspace.deleteRenderedScript(script, false);
    }
}