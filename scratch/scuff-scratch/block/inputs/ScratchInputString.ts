import { BlockInput, BlockInputLiteral } from "scuff";

export class ScratchInputString extends BlockInputLiteral {
    public clone(): BlockInput {
        return new ScratchInputString(this._value);
    }
}