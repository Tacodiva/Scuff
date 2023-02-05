import type { ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "../scruffr/ScruffrBlockRef";
import { ScruffrLiteralInputElement } from "../scruffr/ScruffrLiteralInputElement";
import type { IScruffrBlockInput } from "../scruffr/IScruffrBlockInput";
import type { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";

export class BlockInputString implements IBlockInput {
    private _value: string;

    public constructor(value: string) {
        this._value = value;
    }

    public render(parent: ScruffrBlockInstanceElement, parentRef: ScruffrBlockRef<BlockInputType>): IScruffrBlockInput {
        return new ScruffrLiteralInputElement(parent.content, parentRef.childKey, this._value);
    }
}
