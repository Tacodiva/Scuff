import type { Vec2 } from "../utils/Vec2";
import type BlockInstance from "./BlockInstance";
import Blocks from "./Blocks";
import { SVGRenderedScript } from "./svg/SVGScriptRenderer";

class BlockScript {

    public blocks: BlockInstance[];
    public translation: Vec2;

    public constructor(blocks: BlockInstance[] = [], pos: Vec2 = { x: 0, y: 0 }) {
        this.blocks = blocks;
        this.translation = pos;
    }

}

export { BlockScript }