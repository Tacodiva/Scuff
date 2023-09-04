import type { Target } from "../target";
import type { MutVec2 } from "../utils/Vec2";
import type { BlockInstance } from "./BlockInstance";
import { BlockScript } from "./BlockScript";

export class BlockScriptRoot extends BlockScript {
    public translation: MutVec2;
    public target: Target;

    public constructor(target: Target, blocks?: BlockInstance[], pos: MutVec2 = { x: 0, y: 0 }) {
        super(blocks);
        this.target = target;
        this.translation = pos;
    }

    public clone(target: Target, pos?: MutVec2): BlockScriptRoot {
        return new BlockScriptRoot(target, this._cloneBlocks(), pos ?? this.translation);
    }
}