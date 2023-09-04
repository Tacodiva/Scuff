import { BlockScript } from "./BlockScript";
import type { BlockScriptRoot } from "./BlockScriptRoot";
import type { BlockInstance } from "./BlockInstance";

export class BlockScriptInput extends BlockScript {

    public constructor(blocks?: BlockInstance[]) {
        super(blocks);
    }

    public clone(rootScript: BlockScriptRoot): BlockScriptInput {
        return new BlockScriptInput(this._cloneBlocks());
    }
}
