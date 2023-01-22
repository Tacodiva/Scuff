import type { IBlockPart } from "./BlockParts";
import { ScuffrBlockInputAttachmentPoint, type IScuffrPointAttachable } from "../scuffr/ScuffrAttachmentPoint";
import { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import type { IScuffrBlockInput, IScuffrBlockPartElement, ScuffrBlockContentElement, ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import { ScuffrLiteralInputElement } from "../scuffr/ScuffrLiteralInputElement";
import type { BlockType } from "./BlockType";
import { BlockScript, BlockSubscriptInput } from "./BlockScript";

export interface IBlockInput {
    render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput;
}

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

export class BlockInputString implements IBlockInput {
    private _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput {
        return new ScuffrLiteralInputElement(parent.content, parentRef.childKey, this._value);
    }
}

export class BlockInputTypeString extends BlockInputType {
    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, () => new BlockInputString(defaultValue));
    }

    public isValidValue(value: IBlockInput): IBlockInput | null {
        return value;
    }

    public override hasInputAttachmentPoint(): boolean {
        return true;
    }
}

export class BlockInputTypeSubscript extends BlockInputType<BlockSubscriptInput> {
    public constructor(id: string, block: BlockType) {
        super(id, block, () => new BlockSubscriptInput());
    }

    public isValidValue(value: IBlockInput): BlockSubscriptInput | null {
        if (value instanceof BlockSubscriptInput) return value;
        return null;
    }
}
