import type { IScuffrBlockPartElement } from "../scuffr/IScuffrBlockPartElement";
import type { ScuffrBlockContentElement } from "../scuffr/ScuffrBlockContentElement";

export interface IBlockPart {
    render(block: ScuffrBlockContentElement): IScuffrBlockPartElement;
}


