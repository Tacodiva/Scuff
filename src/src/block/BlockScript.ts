import type { BlockInstance } from "./BlockInstance";

export abstract class BlockScript {

    public blocks: BlockInstance[];

    public constructor(blocks: BlockInstance[] = []) {
        this.blocks = blocks;
    }
}

