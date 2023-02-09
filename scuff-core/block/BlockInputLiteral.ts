import type { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import { ScuffrElementInputLiteral } from "../scuffr/ScuffrElementInputLiteral";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockPartInput } from "./BlockPartInput";
import type { BlockInput } from "./BlockInput";

export abstract class BlockInputLiteral implements BlockInput {
    protected _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public get value() {
        return this._value;
    }

    public set value(value: string) {
        this.value = value;
    }

    public render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput>): ScuffrElementInput {
        return new ScuffrElementInputLiteral(parent.content, parentRef.childKey, this);
    }
}
