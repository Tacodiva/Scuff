import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrSvgBlock } from "../ScuffrSvgBlock";
import { ScuffrSvgBlockInstance } from "../ScuffrSvgBlockInstance";
import type { ScuffrSvgInput } from "../ScuffrSvgInput";
import { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
import type { ScuffrLinkReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrReferenceBlock } from "../ScuffrReferenceTypes";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";

export class ScuffrCmdScriptSelectBlockInput implements ScuffrCmdScriptSelect {
    public source: ScuffrReferenceChain<ScuffrSvgInput | ScuffrSvgBlock>;
    public get workspace() { return this.source.workspace; }

    public targetPosition: Vec2;

    public constructor(source: ScuffrReferenceBlock, position: Vec2) {
        this.source = new ScuffrReferenceChain<ScuffrSvgInput | ScuffrSvgBlock>(source);
        this.targetPosition = position;
    }

    private _getSourceReference(): ScuffrLinkReference<ScuffrSvgInput, ScuffrSvgBlockInstance> {
        const reference = this.source.getTerminalReference();
        if (!(reference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCommandBlockDetachBlock only valid for block instance children.");
        return reference as any;
    }

    public do() {
        const source = this._getSourceReference();
        const block = source.parent.content.detachBlock(source.index);
        const script = new ScuffrSvgScriptRoot(this.workspace, null, [block], this.targetPosition);
        this.workspace.addRenderedScript(script);
    }

    public undo() {
        const source = this._getSourceReference();
        const script = this.workspace.getSelectedScript();
        source.parent.content.setInputByIndex(source.index, script.children[0] as ScuffrSvgBlockInstance);
        this.workspace.deleteRenderedScript(script, false);
    }
}