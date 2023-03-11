import { ScuffrElementInputLiteral } from "../scuffr/ScuffrElementInputLiteral";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockInput } from "./BlockInput";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";

export abstract class BlockInputLiteral implements BlockInput {
    protected _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public abstract clone(): BlockInput;

    public get value() {
        return this._value;
    }

    public set value(value: string) {
        this._value = value;
    }

    public render(reference: ScuffrReferenceInput): ScuffrElementInput {
        return new ScuffrElementInputLiteral(reference, this);
    }
}
