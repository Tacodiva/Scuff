import { BlockPartInput, BlockInput, ScuffrElementInputBlank, ScuffrElementBlockInstance, ScuffrBlockReference, ScuffrElementInput } from "scuff";
import { ScratchBlockTypeTriangle } from "../block-types/ScratchBlockTypeTriangle";

export class ScratchInputBoolean implements BlockInput {
    public static INSTANCE = new ScratchInputBoolean();
    
    public render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput>): ScuffrElementInput {
        return new ScuffrElementInputBlank(parent.content, ScratchBlockTypeTriangle.shape, parentRef.childKey, this);
    }

    public clone(): BlockInput {
        return ScratchInputBoolean.INSTANCE;
    }
}