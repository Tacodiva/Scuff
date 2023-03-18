import { ScuffrSvgBlockInstance } from "../ScuffrSvgBlockInstance";
import { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
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

        if (!(inputReference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        inputReference.parent.content.setInputByIndex(inputReference.index, script.children[0] as ScuffrSvgBlockInstance);
        script.workspace.deleteRenderedScript(script, false);
    }

    public undo(): void {
        const inputReference = this.source.getTerminalReference();

        if (!(inputReference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        const block = inputReference.parent.content.detachBlock(inputReference.index);
        const script = new ScuffrSvgScriptRoot(this.workspace, null, [block]);
        this.workspace.addRenderedScript(script);
    }
}