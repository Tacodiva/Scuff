import { ScratchInputString } from "../inputs/ScratchInputString";
import { BlockPartInput, BlockType, BlockInput } from "scuff";

export class ScratchInputTypeString extends BlockPartInput {
    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, () => new ScratchInputString(defaultValue));
    }

    public isValidValue(value: BlockInput): BlockInput | null {
        return value;
    }

    public override hasInputAttachmentPoint(): boolean {
        return true;
    }
}
