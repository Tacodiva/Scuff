import type { BlockInstance } from "./BlockInstance";
import type { BlockScriptRoot } from "./BlockScriptRoot";

export abstract class BlockScript {

    protected _blocks: BlockInstance[];
    public get blocks(): readonly BlockInstance[] { return this._blocks; }

    public constructor(blocks: BlockInstance[] = []) {
        this._blocks = blocks;
    }

    protected _cloneBlocks(): BlockInstance[] {
        return this._blocks.map(block => block.clone());
    }

    public spliceBlocks(start: number, deleteCount: number, items?: BlockInstance[]): BlockInstance[];
    public spliceBlocks(start: number, deleteCount?: number): BlockInstance[];

    public spliceBlocks(start: number, deleteCount?: number, items?: BlockInstance[]): BlockInstance[] {
        return this._blocks.splice(start, deleteCount!, ...(items ? items : []));
    }
}

