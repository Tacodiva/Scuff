import { ScuffrSvgInputLiteral, type ScuffrSvgBlockPart } from "..";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdSetInputLiteral implements ScuffrCmd {

    public inputReference: ScuffrReferenceChain<ScuffrSvgBlockPart>;
    public get root() { return this.inputReference.root; }

    public readonly targetValue: string;
    public readonly sourceValue: string;

    public constructor(input: ScuffrSvgInputLiteral, targetValue: string, sourceValue?: string) {
        this.inputReference = new ScuffrReferenceChain(input.getReference());
        this.targetValue = targetValue;
        this.sourceValue = sourceValue ?? input.getText();
    }

    private _setInput(value: string) {
        const terminalReference = this.inputReference.getTerminalReference();
        const input = terminalReference.parent.getReferenceValue(terminalReference.index);
        if (!(input instanceof ScuffrSvgInputLiteral))
            throw new Error("ScuffrCmdSetInputLiteral only valid for ScuffrSvgInputLiteral");
        input.setText(value);
    }

    public do(): void {
        this._setInput(this.targetValue);
    }

    public undo(): void {
        this._setInput(this.sourceValue);
    }
}