import { BlockAttachmentPoint, type IBlockAttachmentPointType } from "./BlockAttachmentPoint";
import type { IBlockPart } from "./BlockParts";
import type BlockType from "./BlockType";
import { ScuffrBlockContentElement, ScuffrLiteralInputElement, ScuffrParentRef, type IScuffrBlockPartElement, type ScuffrBlockInstanceElement } from "./svg/SVGBlockRenderer";
import type { SVGRenderedScript } from "./svg/SVGScriptRenderer";

interface IBlockInput {
    render(parent : ScuffrBlockInstanceElement, parentRef: ScuffrParentRef<BlockInputType>, root: SVGRenderedScript): IScuffrBlockPartElement;
    hasAttachmentPoint(): boolean;
}

abstract class BlockInputType implements IBlockPart, IBlockAttachmentPointType {
    public readonly id: string;
    public readonly defaultValue: IBlockInput;

    public readonly block: BlockType;

    public constructor(id: string, block: BlockType, defaultValue: IBlockInput) {
        this.id = id;
        this.defaultValue = defaultValue;
        this.block = block;
    }

    public render(block: ScuffrBlockContentElement, root: SVGRenderedScript): IScuffrBlockPartElement {
        const input = block.parent.block.getInput(this.id);
        const rendered = input.render(block.parent, new ScuffrParentRef(this, block), root);
        if (input.hasAttachmentPoint())
            root.attachmentPoints.push(new BlockAttachmentPoint(rendered, this, { x: 0, y: 0 }));
        return rendered;
    }

    public abstract canTakeValue(value: IBlockInput): boolean;
}

class BlockInputString implements IBlockInput {
    private _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public hasAttachmentPoint(): boolean {
        return true;
    }

    public render(parent : ScuffrBlockInstanceElement, parentRef: ScuffrParentRef<unknown>, root: SVGRenderedScript): IScuffrBlockPartElement {
        return new ScuffrLiteralInputElement(parent.content, this._value);
    }
}

class BlockInputTypeString extends BlockInputType {

    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, new BlockInputString(defaultValue));
    }

    public canTakeValue(value: IBlockInput): boolean {
        return true;
    }
}

export type { IBlockInput };
export { BlockInputType, BlockInputTypeString };