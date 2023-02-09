import type { Vec2 } from "../utils/Vec2";
import type { BlockInstance } from "./BlockInstance";
import { BlockScript } from "./BlockScript";

export class BlockScriptRoot extends BlockScript {
    public translation: Vec2;

    public constructor(blocks?: BlockInstance[], pos: Vec2 = { x: 0, y: 0 }) {
        super(blocks);
        this.translation = pos;
    }

    public clone(): BlockScriptRoot {
        return new BlockScriptRoot(this._clone(), this.translation);
    }
}