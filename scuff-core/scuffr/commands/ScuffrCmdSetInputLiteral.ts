import { ScuffrElementInputLiteral, type ScuffrElementInput, type ScuffrWorkspace } from "..";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdSetInputLiteral implements ScuffrCmd {

    public inputReference: ScuffrReferenceChain<ScuffrElementInput>;
    public get workspace() { return this.inputReference.workspace; }

    public readonly targetValue: string;
    public readonly sourceValue: string;

    public constructor(input: ScuffrElementInputLiteral, targetValue: string, sourceValue?: string) {
        this.inputReference = new ScuffrReferenceChain(input.getReference());
        this.targetValue = targetValue;
        this.sourceValue = sourceValue ?? input.getValue();
    }

    private _setInput(value: string) {
        const terminalReference = this.inputReference.getTerminalReference();
        const input = terminalReference.parent.getReferenceValue(terminalReference.index);
        if (!(input instanceof ScuffrElementInputLiteral))
            throw new Error("ScuffrCmdSetInputLiteral only valid for ScuffrElementInputLiteral");
        input.setValue(value);
    }

    public do(): void {
        this._setInput(this.targetValue);
    }

    public undo(): void {
        this._setInput(this.sourceValue);
    }
}