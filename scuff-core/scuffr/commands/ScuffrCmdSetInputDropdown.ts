import { ScuffrSvgInputDropdown, ScuffrSvgInputLiteral, type ScuffrSvgInput, type ScuffrWorkspace } from "..";
import type { BlockDropdownOption } from "../../block";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdSetInputDropdown implements ScuffrCmd {

    public inputReference: ScuffrReferenceChain<ScuffrSvgInput>;
    public get root() { return this.inputReference.root; }

    public readonly targetValue: BlockDropdownOption;
    public readonly sourceValue: BlockDropdownOption;

    public constructor(input: ScuffrSvgInputDropdown, targetValue: BlockDropdownOption, sourceValue?: BlockDropdownOption) {
        this.inputReference = new ScuffrReferenceChain(input.getReference());
        this.targetValue = targetValue;
        this.sourceValue = sourceValue ?? input.value;
    }

    private _setInput(value: BlockDropdownOption) {
        const terminalReference = this.inputReference.getTerminalReference();
        const input = terminalReference.parent.getReferenceValue(terminalReference.index);
        if (!(input instanceof ScuffrSvgInputDropdown))
            throw new Error("ScuffrCmdSetInputDropdown only valid for ScuffrSvgInputDropdown");
        input.setValue(value);
    }

    public do(): void {
        this._setInput(this.targetValue);
    }

    public undo(): void {
        this._setInput(this.sourceValue);
    }
}