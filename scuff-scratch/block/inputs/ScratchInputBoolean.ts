import {  BlockInput, ScuffrSvgInputBlank, ScuffrSvgInput, ScuffrReferenceBlock, ScuffrReferenceInput } from "scuff";
import { ScratchBlockTypeTriangle } from "../block-types/ScratchBlockTypeTriangle";

export class ScratchInputBoolean implements BlockInput {
    public static INSTANCE = new ScratchInputBoolean();
    
    public render(reference: ScuffrReferenceInput): ScuffrSvgInput {
        return new ScuffrSvgInputBlank(reference, ScratchBlockTypeTriangle.shape, this);
    }

    public clone(): BlockInput {
        return ScratchInputBoolean.INSTANCE;
    }
}