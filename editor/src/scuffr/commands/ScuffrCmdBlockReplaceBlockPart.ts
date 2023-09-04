import { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import type { ScuffrReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdBlockReplaceBlockPart implements ScuffrCmd {

    public targetPart: ScuffrReferenceChain;
    public get root() { return this.targetPart.root; }

    public constructor(targetPart: ScuffrReference) {
        this.targetPart = new ScuffrReferenceChain(targetPart);
    }

    public do(): void {
        const script = this.root.getSelectedScript();
        const inputReference = this.targetPart.getTerminalReference();

        if (!(inputReference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        const replacedChild = inputReference.parent.content.replaceChild(inputReference.index, script.children[0] as ScuffrSvgBlockInstance);
        this.root.deleteScript(script, false);
    }

    public undo(): void {
        const inputReference = this.targetPart.getTerminalReference();

        if (!(inputReference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCmdTakeScriptInput target parent must be a block instance");

        const block = inputReference.parent.content.detachBlock(inputReference.index);
        this.root.createScript([block]);
    }
}