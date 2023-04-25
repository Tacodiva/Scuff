import type { ScuffrSvgInput } from "../scuffr/svg/ScuffrSvgInput";
import type { BlockInput } from "./BlockInput";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";
import { ScuffrSvgInputStatic } from "../scuffr/svg/ScuffrSvgInputStatic";

export abstract class BlockInputStatic implements BlockInput {
    protected _text: string;
    public get text() { return this._text; }
    
    public constructor(text: string) {
        this._text = text;
    }

    public abstract clone(): BlockInput;

    public render(reference: ScuffrReferenceInput): ScuffrSvgInput {
        return new ScuffrSvgInputStatic(reference, this);
    }
}
