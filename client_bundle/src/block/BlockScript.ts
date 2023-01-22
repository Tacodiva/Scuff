import type { IScruffrPointAttachable } from "../scruffr/ScruffrAttachmentPoint";
import type { IScruffrBlockInput, ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "../scruffr/ScruffrBlockRef";
import { ScruffrInputSubscriptElement } from "../scruffr/ScruffrScriptElement";
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

    public render(parent: ScruffrBlockInstanceElement, parentRef: ScruffrBlockRef<BlockInputType>): IScruffrBlockInput {
        return new ScruffrInputSubscriptElement(parent, this);
    }
    
}