import type { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import { ScuffrElementInputLiteral } from "../scuffr/ScuffrElementInputLiteral";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockPartInput } from "./BlockPartInput";
import type { BlockInput } from "./BlockInput";
import type { ScuffrElementBlockContent } from "../scuffr";

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

    public render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput {
        return new ScuffrElementInputLiteral(parent.content, parentRef.childKey, this);
    }
}
