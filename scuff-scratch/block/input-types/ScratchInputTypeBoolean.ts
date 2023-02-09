import { ScratchInputBoolean } from "../inputs/ScratchInputBoolean";
import { BlockPartInput, BlockType, BlockInput } from "scuff";

export class ScratchInputTypeBoolean extends BlockPartInput {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => ScratchInputBoolean.INSTANCE);
    }

    public isValidValue(value: BlockInput): BlockInput | null {
        return value;
    }

    public override hasInputAttachmentPoint(): boolean {
        return true;
    }
}
