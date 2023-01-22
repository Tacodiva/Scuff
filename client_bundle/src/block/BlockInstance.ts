import { ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { IBlockInput } from "./BlockInputType";
import type { BlockInputType } from "./BlockInputType";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import type { BlockType } from "./BlockType";

class BlockInputInstanceInput<T extends IBlockInput = IBlockInput> {
    public readonly type: BlockInputType<T>;
    public value: T;

    public constructor(type: BlockInputType<T>) {
        this.type = type;
        this.value = type.defaultValueFactory();
    }

    public set(value: IBlockInput) {
        const castValue = this.type.isValidValue(value);
        if (!castValue) throw new Error(`Input valie ${value} not valid for input ${this.type.id}.`);
        this.value = castValue;
    }

    public reset() {
        this.value = this.type.defaultValueFactory();
    }
}

export class BlockInstance implements IBlockInput {
    public readonly type: BlockType;
    private readonly _inputs: Map<string, BlockInputInstanceInput>;

    public constructor(type: BlockType) {
        this.type = type;
        this._inputs = new Map();

        for (let input of type.inputs) {
            this._inputs.set(input.id, new BlockInputInstanceInput(input));
        }
    }

    public hasAttachmentPoint(): boolean {
        return false;
    }

    private _getInputFromID(id: string): BlockInputInstanceInput {
        const input = this._inputs.get(id);
        if (!input) throw new Error(`No input ${id} on block ${this.type.id}.`);
        return input;
    }

    public getInputByID(id: string): IBlockInput {
        return this._getInputFromID(id).value;
    }

    private _getInput<T extends IBlockInput>(inputType: BlockInputType<T>): BlockInputInstanceInput<T> {
        const input = this._getInputFromID(inputType.id);
        if (input.type !== inputType)
            throw new Error(`Input of id ${inputType.id} on block ${this.type.id} is the wrong type.`);
        // Should be safe thanks to the check above
        return <BlockInputInstanceInput<T>>input;
    }

    public getInput<T extends IBlockInput>(inputType: BlockInputType<T>): T {
        return this._getInput(inputType).value;
    }

    public setInputByID(inputID: string, value: IBlockInput) {
        this._getInputFromID(inputID).set(value);
    }

    public setInput<T extends IBlockInput>(inputType: BlockInputType<T>, value : T) {
        this._getInput(inputType).value = value;
    }

    public resetInput(inputID : string) {
        this._getInputFromID(inputID).reset();
    }

    public render(parent: ScuffrBlockInstanceElement | null, parentRef: ScuffrBlockRef<unknown>): ScuffrBlockInstanceElement {
        return new ScuffrBlockInstanceElement(this, parentRef);
    }
}