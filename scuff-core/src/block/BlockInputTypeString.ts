import { BlockInputType } from "./BlockInputType";
import { BlockInputString } from "./BlockInputString";
import type { BlockType } from "./BlockType";
import type { IBlockInput } from "./IBlockInput";


export class BlockInputTypeString extends BlockInputType {
    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, () => new BlockInputString(defaultValue));
    }

    public isValidValue(value: IBlockInput): IBlockInput | null {
        return value;
    }

    public override hasInputAttachmentPoint(): boolean {
        return true;
    }
}
