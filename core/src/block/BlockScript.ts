import type { BlockInstance } from "./BlockInstance";

export abstract class BlockScript {

    public blocks: BlockInstance[];

    public constructor(blocks: BlockInstance[] = []) {
        this.blocks = blocks;
    }

    protected _clone(): BlockInstance[] {
        return this.blocks.map(block => block.clone());
    }
}

