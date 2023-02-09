import { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { BlockInput } from "./BlockInput";
import type { BlockPartInput } from "./BlockPartInput";
import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import type { BlockType } from "./BlockType";

class BlockInputInstanceInput<T extends BlockInput = BlockInput> {
    public readonly type: BlockPartInput<T>;
    public value: T;

    public constructor(type: BlockPartInput<T>) {
        this.type = type;
        this.value = type.defaultValueFactory();
    }

    public set(value: BlockInput) {
        const castValue = this.type.isValidValue(value);
        if (!castValue) throw new Error(`Input valie ${value} not valid for input ${this.type.id}.`);
        this.value = castValue;
    }

    public reset() {
        this.value = this.type.defaultValueFactory();
    }
}

export class BlockInstance implements BlockInput {
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

    public getInputByID(id: string): BlockInput {
        return this._getInputFromID(id).value;
    }

    private _getInput<T extends BlockInput>(inputType: BlockPartInput<T>): BlockInputInstanceInput<T> {
        const input = this._getInputFromID(inputType.id);
        if (input.type !== inputType)
            throw new Error(`Input of id ${inputType.id} on block ${this.type.id} is the wrong type.`);
        // Should be safe thanks to the check above
        return <BlockInputInstanceInput<T>>input;
    }

    public getInput<T extends BlockInput>(inputType: BlockPartInput<T>): T {
        return this._getInput(inputType).value;
    }

    public setInputByID(inputID: string, value: BlockInput) {
        this._getInputFromID(inputID).set(value);
    }

    public setInput<T extends BlockInput>(inputType: BlockPartInput<T>, value : T) {
        this._getInput(inputType).value = value;
    }

    public resetInput(inputID : string) {
        this._getInputFromID(inputID).reset();
    }

    public render(parent: ScuffrElementBlockInstance | null, parentRef: ScuffrBlockReference<unknown>): ScuffrElementBlockInstance {
        return new ScuffrElementBlockInstance(this, parentRef);
    }
}