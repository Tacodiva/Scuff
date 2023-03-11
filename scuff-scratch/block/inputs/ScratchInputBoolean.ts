import {  BlockInput, ScuffrElementInputBlank, ScuffrElementInput, ScuffrReferenceBlock, ScuffrReferenceInput } from "scuff";
import { ScratchBlockTypeTriangle } from "../block-types/ScratchBlockTypeTriangle";

export class ScratchInputBoolean implements BlockInput {
    public static INSTANCE = new ScratchInputBoolean();
    
    public render(reference: ScuffrReferenceInput): ScuffrElementInput {
        return new ScuffrElementInputBlank(reference, ScratchBlockTypeTriangle.shape, this);
    }

    public clone(): BlockInput {
        return ScratchInputBoolean.INSTANCE;
    }
}