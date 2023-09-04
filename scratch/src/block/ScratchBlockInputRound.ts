import { BlockInput, BlockInstance } from "@scuff/core";

export class ScratchBlockInputRound extends BlockInput<string | BlockInstance> {

    public constructor() {
        super();
        // this.setComponent()
    }

    public clone(value: string | BlockInstance): string | BlockInstance {
        if (typeof value === "string")
            return value;
        if (!(value instanceof BlockInstance))
            throw new Error(`Unknown round block value ${value}`);
        return value.clone();
    }

}