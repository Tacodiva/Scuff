import type { IScruffrBlockPartElement } from "../scruffr/IScruffrBlockPartElement";
import type { ScruffrBlockContentElement } from "../scruffr/ScruffrBlockContentElement";

export interface IBlockPart {
    render(block: ScruffrBlockContentElement): IScruffrBlockPartElement;
}


