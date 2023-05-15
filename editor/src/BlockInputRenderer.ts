import type { BlockInstance } from "@scuff/core";
import type { ScuffrColouredShape, ScuffrSvgBlockPart } from "./scuffr";

export abstract class BlockTypeComponentRenderer {

    public static readonly id: string = "editor:block_renderer";

    public abstract getBackground(block: BlockInstance): ScuffrColouredShape;
    public abstract createParts(block: BlockInstance): ScuffrSvgBlockPart[];

}