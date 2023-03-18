import { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
import type { Vec2 } from "../../utils/Vec2";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";
import type { ScuffrReference } from "../ScuffrReference";
import { ScuffrSvgScript } from "..";


export class ScuffrCmdScriptSelectScriptBlocks implements ScuffrCmdScriptSelect {

    public readonly source: ScuffrReferenceChain;
    public readonly sourceStart: number;
    public readonly sourceCount: number;

    public get workspace() { return this.source.workspace; }

    public targetPosition: Vec2;

    public constructor(source: ScuffrReference, start: number, count: number, targetPosition: Vec2) {
        this.source = new ScuffrReferenceChain(source);
        this.sourceStart = start;
        this.sourceCount = count;
        this.targetPosition = targetPosition;
    }

    private _getInputScript(): ScuffrSvgScript {
        const reference = this.source.getTerminalReference();
        const inputScript = reference.parent.getReferenceValue(reference.index);
        if (!(inputScript instanceof ScuffrSvgScript))
            throw new Error("ScuffrCmdScriptSelectScriptInput target input must be a script.");
        return inputScript;
    }


    public do(): void {
        const inputScript = this._getInputScript();

        const blocks = inputScript.spliceBlocks(this.sourceStart, this.sourceCount);
        const rootScript = new ScuffrSvgScriptRoot(this.workspace, null, blocks, this.targetPosition);

        this.workspace.addRenderedScript(rootScript);
    }

    public undo(): void {
        const inputScript = this._getInputScript();
        const rootScript = this.workspace.getSelectedScript();

        inputScript.spliceBlocks(this.sourceStart, 0, rootScript.children);
        this.workspace.deleteRenderedScript(rootScript, false);
    }
}