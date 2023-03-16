import { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdAttchInputTakeScript implements ScuffrCmd {

    public source: ScuffrReferenceChain;
    public get workspace() { return this.source.workspace; }

    public constructor(input: ScuffrReference) {
        this.source = new ScuffrReferenceChain(input);
    }

    public do(): void {
        const script = this.workspace.getSelectedScript();
        const inputReference = this.source.getTerminalReference();

        if (!(inputReference.parent instanceof ScuffrElementBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        inputReference.parent.content.setInputByIndex(inputReference.index, script.children[0] as ScuffrElementBlockInstance);
        script.workspace.deleteRenderedScript(script, false);
    }

    public undo(): void {
        const inputReference = this.source.getTerminalReference();

        if (!(inputReference.parent instanceof ScuffrElementBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        const block = inputReference.parent.content.detachBlock(inputReference.index);
        const script = new ScuffrElementScriptRoot(this.workspace, null, [block]);
        this.workspace.addRenderedScript(script);
    }
}