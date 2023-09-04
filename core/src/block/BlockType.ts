import type { BlockInputValue, BlockInputs, BlockInputsDef } from "./BlockInputs";
import { BlockInstance } from "./BlockInstance";
import { ComponentContainer } from "./ComponentContainer";

export type BlockInputDefaults<InputsDef extends BlockInputsDef> = {
    [K in keyof InputsDef]: (() => BlockInputValue<InputsDef[K]>) | undefined
}

export type PartialBlockInputs<
    InputsDef extends BlockInputsDef,
    InputDefaults extends BlockInputDefaults<InputsDef>> = {
        [K in keyof InputsDef]: InputDefaults[K] extends undefined ?
        BlockInputs<InputsDef>[K] :
        BlockInputs<InputsDef>[K] | undefined;
    }

export class BlockType<InputsDef extends BlockInputsDef = BlockInputsDef, InputDefaults extends BlockInputDefaults<InputsDef> = BlockInputDefaults<InputsDef>> extends ComponentContainer {
    public readonly inputs: InputsDef;
    public readonly defaults: InputDefaults;

    public constructor(inputs: InputsDef, defaults: InputDefaults) {
        super();
        this.inputs = inputs;
        this.defaults = defaults;
    }

    public createInstance(inputs: PartialBlockInputs<InputsDef, InputDefaults>): BlockInstance<InputsDef, this> {
        let fullInputs = {} as any;
        for (const inputKey in this.inputs) {
            let input = inputs[inputKey] as any;
            if (input === undefined) input = this.defaults[inputKey];
            fullInputs[inputKey] = input;
        }
        return new BlockInstance(this, fullInputs);
    }

    public canStackDown = (block: BlockInstance) => true;
    public canStackUp = (block: BlockInstance) => true;
}