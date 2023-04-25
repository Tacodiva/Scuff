import { BlockInput, BlockInputStatic, ScuffrReferenceInput, ScuffrSvgInput, ScuffrSvgInputStatic } from "scuff";
import { ScratchVariable } from "../ScratchVariable";

export class ScratchInputVariable extends BlockInputStatic {
    public readonly variable: ScratchVariable | null;

    public constructor(variable: ScratchVariable | null) {
        super(variable?.name ?? "null");
        this.variable = variable;
    }

    public override render(reference: ScuffrReferenceInput): ScuffrSvgInput {
        return new ScuffrSvgInputStatic(reference, this);
    }

    public clone(): BlockInput {
        return this;
    }
}