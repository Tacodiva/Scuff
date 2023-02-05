import type { BlockType } from "./BlockType";
import { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";
import { BlockInputBooleanBlank } from "./BlockInputBooleanBlank";


export class BlockInputTypeBoolean extends BlockInputType {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => BlockInputBooleanBlank.INSTANCE);
    }

    public isValidValue(value: IBlockInput): IBlockInput | null {
        return value;
    }

    public override hasInputAttachmentPoint(): boolean {
        return true;
    }
}
