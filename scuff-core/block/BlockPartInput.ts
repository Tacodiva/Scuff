import { ScuffrAttachmentPointBlockInput } from "../scuffr/attachment-points/ScuffrAttachmentPointBlockInput";
import type { BlockPart } from "./BlockPart";
import type { BlockType } from "./BlockType";
import type { ScuffrSvgInput } from "../scuffr/svg/ScuffrSvgInput";
import type { BlockInput } from "./BlockInput";
import type { ScuffrSvgBlockContent } from "../scuffr/svg/ScuffrSvgBlockContent";
import type { BlockInstance } from "./BlockInstance";

export abstract class BlockPartInput<T extends BlockInput = BlockInput> implements BlockPart {
    public readonly name: string;
    public readonly index: number;
    public readonly defaultValueFactory: (block: BlockInstance) => T;

    public readonly blockType: BlockType;

    public constructor(index: number, name: string, blockType: BlockType, defaultValueFactory: (block: BlockInstance) => T) {
        this.name = name;
        this.index = index;
        this.defaultValueFactory = defaultValueFactory;
        this.blockType = blockType;
    }

    public render(block: ScuffrSvgBlockContent): ScuffrSvgInput {
        return block.block.getInput(this).render({ index: this.index, parent: block });
    }

    public createAttachmentPoints(block: ScuffrSvgBlockContent, rendered: ScuffrSvgInput): void {
        if (this.hasInputAttachmentPoint())
            new ScuffrAttachmentPointBlockInput(block.parent, this, rendered);
    }

    public hasInputAttachmentPoint(): boolean {
        return true;
    }

    public abstract isValidValue(block: BlockInstance, value: BlockInput): T | false;
}