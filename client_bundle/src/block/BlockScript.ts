import type { IScuffrPointAttachable } from "../scuffr/ScuffrAttachmentPoint";
import type { IScuffrBlockInput, ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import { ScuffrInputSubscriptElement } from "../scuffr/ScuffrScriptElement";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInputType, IBlockInput } from "./BlockInputType";
import type { BlockInstance } from "./BlockInstance";

export abstract class BlockScript {

    public blocks: BlockInstance[];

    public constructor(blocks: BlockInstance[] = []) {
        this.blocks = blocks;
    }
}

export class BlockScriptRoot extends BlockScript {
    public translation: Vec2;
    
    public constructor(blocks?: BlockInstance[], pos: Vec2 = { x: 0, y: 0 }) {
        super(blocks);
        this.translation = pos;
    }
}

export class BlockSubscriptInput extends BlockScript {

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput {
        return new ScuffrInputSubscriptElement(parent, this);
    }
    
}