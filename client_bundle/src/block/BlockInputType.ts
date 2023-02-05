import { ScruffrBlockInputAttachmentPoint } from "../scruffr/attachment_points/ScruffrBlockInputAttachmentPoint";
import { ScruffrBlockRef, type IScruffrBlockParent } from "../scruffr/ScruffrBlockRef";
import type { IBlockPart } from "./IBlockPart";
import type { BlockType } from "./BlockType";
import type { IScruffrBlockInput } from "../scruffr/IScruffrBlockInput";
import type { ScruffrBlockContentElement } from "../scruffr/ScruffrBlockContentElement";
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

    public render(block: ScruffrBlockContentElement): IScruffrBlockInput {
        return block.parent.block.getInput(this).render(block.parent, new ScruffrBlockRef(this, block));
    }

    public createAttachmentPoints(block: ScruffrBlockContentElement, rendered: IScruffrBlockInput): void {
        if (this.hasInputAttachmentPoint())
            new ScruffrBlockInputAttachmentPoint(block.parent, this, rendered);
    }

    public hasInputAttachmentPoint(): boolean {
        return false;
    }

    public abstract isValidValue(value: IBlockInput): T | null;
}


