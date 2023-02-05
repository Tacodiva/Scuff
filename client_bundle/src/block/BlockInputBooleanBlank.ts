import type { ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import type { IScuffrBlockInput } from "../scuffr/IScuffrBlockInput";
import { ScuffrBlankInputElement } from "../scuffr/ScuffrBlankInputElement";
import type { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";


export class BlockInputBooleanBlank implements IBlockInput {

    public static INSTANCE = new BlockInputBooleanBlank();

    private BlockInputBooleanBlank() {
    }

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput {
        return new ScuffrBlankInputElement(parent.content, parentRef.childKey);
    }
}
