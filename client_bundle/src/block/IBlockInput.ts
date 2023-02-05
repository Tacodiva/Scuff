import type { ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "../scruffr/ScruffrBlockRef";
import type { IScruffrBlockInput } from "../scruffr/IScruffrBlockInput";
import type { BlockInputType } from "./BlockInputType";


export interface IBlockInput {
    render(parent: ScruffrBlockInstanceElement, parentRef: ScruffrBlockRef<BlockInputType>): IScruffrBlockInput;
}
