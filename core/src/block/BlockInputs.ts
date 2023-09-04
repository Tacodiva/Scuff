import { ComponentContainer } from "./ComponentContainer";

export abstract class BlockInput<Value = any> extends ComponentContainer {
    public abstract clone(value: Value): Value;
}

export type BlockInputsDef = Record<string, BlockInput>;

export type BlockInputValue<InputDef extends BlockInput> = InputDef extends BlockInput<infer Value> ? Value : never;

export type BlockInputs<InputsDef extends BlockInputsDef> = {
    [K in keyof InputsDef]: BlockInputValue<InputsDef[K]>;
};
