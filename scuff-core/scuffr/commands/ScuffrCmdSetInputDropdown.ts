import { ScuffrElementInputDropdown, ScuffrElementInputLiteral, type ScuffrElementInput, type ScuffrWorkspace } from "..";
import type { BlockDropdownOption } from "../../block";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdSetInputDropdown implements ScuffrCmd {

    public inputReference: ScuffrReferenceChain<ScuffrElementInput>;
    public get workspace() { return this.inputReference.workspace; }

    public readonly targetValue: BlockDropdownOption;
    public readonly sourceValue: BlockDropdownOption;

    public constructor(input: ScuffrElementInputDropdown, targetValue: BlockDropdownOption, sourceValue?: BlockDropdownOption) {
        this.inputReference = new ScuffrReferenceChain(input.getReference());
        this.targetValue = targetValue;
        this.sourceValue = sourceValue ?? input.value;
    }

    private _setInput(value: BlockDropdownOption) {
        const terminalReference = this.inputReference.getTerminalReference();
        const input = terminalReference.parent.getReferenceValue(terminalReference.index);
        if (!(input instanceof ScuffrElementInputDropdown))
            throw new Error("ScuffrCmdSetInputDropdown only valid for ScuffrElementInputDropdown");
        input.setValue(value);
    }

    public do(): void {
        this._setInput(this.targetValue);
    }

    public undo(): void {
        this._setInput(this.sourceValue);
    }
}