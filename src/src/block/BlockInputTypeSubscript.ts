import { BlockSubscriptInput } from "./BlockSubscriptInput";
import type { BlockType } from "./BlockType";
import { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";


export class BlockInputTypeSubscript extends BlockInputType<BlockSubscriptInput> {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => new BlockSubscriptInput());
    }

    public isValidValue(value: IBlockInput): BlockSubscriptInput | null {
        if (value instanceof BlockSubscriptInput)
            return value;
        return null;
    }
}
