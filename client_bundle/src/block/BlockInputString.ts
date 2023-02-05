import type { ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import { ScuffrLiteralInputElement } from "../scuffr/ScuffrLiteralInputElement";
import type { IScuffrBlockInput } from "../scuffr/IScuffrBlockInput";
import type { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";

export class BlockInputString implements IBlockInput {
    private _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput {
        return new ScuffrLiteralInputElement(parent.content, parentRef.childKey, this._value);
    }
}
