import type { IBlockPart } from "./BlockParts";
import { ScuffrBlockInputAttachmentPoint, type IScuffrPointAttachable } from "../scuffr/ScuffrAttachmentPoint";
import { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import type { ScuffrBlockContentElement, ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import { ScuffrLiteralInputElement } from "../scuffr/ScuffrLiteralInputElement";
import type { BlockType } from "./BlockType";

export interface IBlockInput {
    render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrPointAttachable;
}

export abstract class BlockInputType implements IBlockPart {
    public readonly id: string;
    public readonly defaultValue: IBlockInput;

    public readonly block: BlockType;

    public constructor(id: string, block: BlockType, defaultValue: IBlockInput) {
        this.id = id;
        this.defaultValue = defaultValue;
        this.block = block;
    }

    public render(block: ScuffrBlockContentElement): IScuffrPointAttachable {
        const input = block.parent.block.getInput(this.id);
        const rendered = input.render(block.parent, new ScuffrBlockRef(this, block));
        new ScuffrBlockInputAttachmentPoint(block.parent, this, rendered);
        return rendered;
    }

    public abstract canTakeValue(value: IBlockInput): boolean;
}

export class BlockInputString implements IBlockInput {
    private _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public hasAttachmentPoint(): boolean {
        return true;
    }

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrPointAttachable {
        return new ScuffrLiteralInputElement(parent.content, parentRef.childKey, this._value);
    }
}

export class BlockInputTypeString extends BlockInputType {

    public constructor(id: string, block: BlockType, defaultValue: string = "") {
        super(id, block, new BlockInputString(defaultValue));
    }

    public canTakeValue(value: IBlockInput): boolean {
        return true;
    }
}
