import type { BlockInputs, BlockInputsDef } from "./BlockInputs";
import type { BlockScriptRoot } from "./BlockScriptRoot";
import type { BlockType } from "./BlockType";

export class BlockInstance<InputsDef extends BlockInputsDef = BlockInputsDef, Type extends BlockType<InputsDef> = BlockType<InputsDef>> {
    public readonly type: Type;
    private readonly _inputs: BlockInputs<InputsDef>;

    public constructor(type: Type, inputs: BlockInputs<InputsDef>) {
        this.type = type;
        this._inputs = inputs;
    }

    public getInput<K extends keyof InputsDef>(input: K): BlockInputs<InputsDef>[K] {
        return this._inputs[input];
    }

    public setInput<K extends keyof InputsDef>(input: K, value: BlockInputs<InputsDef>[K]) {
        this._inputs[input] = value;
    }

    public clone(): BlockInstance<InputsDef, Type> {
        return new BlockInstance(this.type, null as any);
    }
}