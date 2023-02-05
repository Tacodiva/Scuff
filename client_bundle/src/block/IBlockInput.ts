import type { ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import type { IScuffrBlockInput } from "../scuffr/IScuffrBlockInput";
import type { BlockInputType } from "./BlockInputType";


export interface IBlockInput {
    render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput;
}
