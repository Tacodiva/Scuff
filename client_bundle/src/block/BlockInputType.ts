import { ScuffrBlockInputAttachmentPoint } from "../scuffr/attachment_points/ScuffrBlockInputAttachmentPoint";
import { ScuffrBlockRef, type IScuffrBlockParent } from "../scuffr/ScuffrBlockRef";
import type { IBlockPart } from "./IBlockPart";
import type { BlockType } from "./BlockType";
import type { IScuffrBlockInput } from "../scuffr/IScuffrBlockInput";
import type { ScuffrBlockContentElement } from "../scuffr/ScuffrBlockContentElement";
import type { IBlockInput } from "./IBlockInput";

export abstract class BlockInputType<T extends IBlockInput = IBlockInput> implements IBlockPart {
    public readonly id: string;
    public readonly defaultValueFactory: () => T;

    public readonly block: BlockType;

    public constructor(id: string, block: BlockType, defaultValueFactory: () => T) {
        this.id = id;
        this.defaultValueFactory = defaultValueFactory;
        this.block = block;
    }

    public render(block: ScuffrBlockContentElement): IScuffrBlockInput {
        return block.parent.block.getInput(this).render(block.parent, new ScuffrBlockRef(this, block));
    }

    public createAttachmentPoints(block: ScuffrBlockContentElement, rendered: IScuffrBlockInput): void {
        if (this.hasInputAttachmentPoint())
            new ScuffrBlockInputAttachmentPoint(block.parent, this, rendered);
    }

    public hasInputAttachmentPoint(): boolean {
        return false;
    }

    public abstract isValidValue(value: IBlockInput): T | null;
}


