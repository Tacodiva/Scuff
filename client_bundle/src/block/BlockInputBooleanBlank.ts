import type { ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "../scruffr/ScruffrBlockRef";
import type { IScruffrBlockInput } from "../scruffr/IScruffrBlockInput";
import { ScruffrBlankInputElement } from "../scruffr/ScruffrBlankInputElement";
import type { BlockInputType } from "./BlockInputType";
import type { IBlockInput } from "./IBlockInput";


export class BlockInputBooleanBlank implements IBlockInput {

    public static INSTANCE = new BlockInputBooleanBlank();

    private BlockInputBooleanBlank() {
    }

    public render(parent: ScruffrBlockInstanceElement, parentRef: ScruffrBlockRef<BlockInputType>): IScruffrBlockInput {
        return new ScruffrBlankInputElement(parent.content, parentRef.childKey);
    }
}
