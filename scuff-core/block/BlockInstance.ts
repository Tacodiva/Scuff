import { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrReferenceBlock } from "../scuffr/ScuffrReferenceTypes";
import type { BlockInput } from "./BlockInput";
import type { BlockPartInput } from "./BlockPartInput";
import type { BlockType } from "./BlockType";

class BlockInputInstanceInput<T extends BlockInput = BlockInput> {
    public readonly type: BlockPartInput<T>;
    public readonly block: BlockInstance;
    public value: T;

    public constructor(block: BlockInstance, type: BlockPartInput<T>) {
        this.type = type;
        this.block = block;
        this.value = type.defaultValueFactory(block);
    }

    public set(value: BlockInput) {
        const valid = this.type.isValidValue(this.block, value);
        if (!valid) throw new Error(`Input value ${value} not valid for input ${this.type.name}.`);
        this.value = valid;
    }

    public reset() {
        this.value = this.type.defaultValueFactory(this.block);
    }
}

export class BlockInstance implements BlockInput {
    public readonly type: BlockType;
    private readonly _inputs: BlockInputInstanceInput[];

    public constructor(type: BlockType);

    public constructor(type: BlockType) {
        this.type = type;
        this._inputs = [];

        for (const input of type.inputs) {
            this._inputs.push(new BlockInputInstanceInput(this, input));
        }
    }

    public clone(): BlockInstance {
        const clone = new BlockInstance(this.type);
        for (let i = 0; i < this._inputs.length; i++) {
            clone._inputs[i].value = this._inputs[i].value.clone();
        }
        return clone;
    }

    public hasAttachmentPoint(): boolean {
        return false;
    }

    private _getInput<T extends BlockInput>(inputType: BlockPartInput<T>): BlockInputInstanceInput<T> {
        const input = this._inputs[inputType.index];
        if (input.type !== inputType)
            throw new Error(`Input of id ${inputType.name} on block ${this.type.id} is the wrong type.`);
        // Should be safe thanks to the check above
        return <BlockInputInstanceInput<T>>input;
    }

    public getInput<T extends BlockInput>(inputType: BlockPartInput<T>): T {
        return this._getInput(inputType).value;
    }

    public getInputByIndex(index: number): BlockInput {
        return this._inputs[index].value;
    }


    public setInput<T extends BlockInput>(inputType: BlockPartInput<T>, value: T) {
        this._getInput(inputType).value = value;
    }

    public setInputByIndex(index: number, value: BlockInput) {
        this._inputs[index].set(value);
    }

    public resetInput(inputType: BlockPartInput) {
        this._inputs[inputType.index].reset();
    }

    public resetInputByIndex(index: number) {
        this._inputs[index].reset();
    }

    public render(reference: ScuffrReferenceBlock): ScuffrElementBlockInstance {
        return new ScuffrElementBlockInstance(this, reference);
    }
}