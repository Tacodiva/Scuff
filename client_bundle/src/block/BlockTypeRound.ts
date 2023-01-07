import type BlockInstance from "./BlockInstance";
import BlockType from "./BlockType";
import { ScuffrBackground, ScuffrBackgroundShape } from "./svg/SVGBackgroundRenderer";
import type { ISVGBlockRenderRenderable } from "./svg/SVGBlockRenderer";

abstract class BlockTypeRound extends BlockType implements ISVGBlockRenderRenderable {

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(ScuffrBackgroundShape.ROUND_BLOCK, this.category.colorPrimary, this.category.colorTertiary);
    }

}

export { BlockTypeRound as default }