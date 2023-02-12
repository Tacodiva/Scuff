import { ScuffrAttachmentPointBlockInput } from "../scuffr/attachment-points/ScuffrAttachmentPointBlockInput";
import { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import type { BlockPart } from "./BlockPart";
import type { BlockType } from "./BlockType";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockInput } from "./BlockInput";
import type { ScuffrElementBlockContent } from "../scuffr/ScuffrElementBlockContent";

export abstract class BlockPartInput<T extends BlockInput = BlockInput> implements BlockPart {
    public readonly id: string;
    public readonly defaultValueFactory: () => T;

    public readonly block: BlockType;

    public constructor(id: string, block: BlockType, defaultValueFactory: () => T) {
        this.id = id;
        this.defaultValueFactory = defaultValueFactory;
        this.block = block;
    }

    public render(block: ScuffrElementBlockContent): ScuffrElementInput {
        return block.parent.block.getInput(this).render(block.parent, new ScuffrBlockReference(this, block));
    }

    public createAttachmentPoints(block: ScuffrElementBlockContent, rendered: ScuffrElementInput): void {
        if (this.hasInputAttachmentPoint())
            new ScuffrAttachmentPointBlockInput(block.parent, this, rendered);
    }

    public hasInputAttachmentPoint(): boolean {
        return true;
    }

    public abstract isValidValue(value: BlockInput): T | false;
}


