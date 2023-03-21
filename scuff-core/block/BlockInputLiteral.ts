import { ScuffrSvgInputLiteral } from "../scuffr/svg/ScuffrSvgInputLiteral";
import type { ScuffrSvgInput } from "../scuffr/svg/ScuffrSvgInput";
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

    public render(reference: ScuffrReferenceInput): ScuffrSvgInput {
        return new ScuffrSvgInputLiteral(reference, this);
    }
}
