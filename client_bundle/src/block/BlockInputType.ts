import type BlockInstance from "./BlockInstance";
import type { IBlockPart } from "./BlockParts";
import type { BlockScript } from "./BlockScript";
import type BlockType from "./BlockType";
import { ScuffrBlockInputAttachmentPoint } from "./svg/ScuffrAttachmentPoint";
import { ScuffrBlockContentElement, ScuffrLiteralInputElement, ScuffrParentRef, type IScuffrBlockPartElement, type ScuffrBlockInstanceElement } from "./svg/SVGBlockRenderer";
import type { SVGRenderedScript } from "./svg/SVGScriptRenderer";

interface IBlockInput {
    render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrParentRef<BlockInputType>, root: SVGRenderedScript): IScuffrBlockPartElement;
}

abstract class BlockInputType implements IBlockPart {
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
        root.attachmentPoints.push(new ScuffrBlockInputAttachmentPoint(block.parent, this, rendered));
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

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrParentRef<unknown>, root: SVGRenderedScript): IScuffrBlockPartElement {
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