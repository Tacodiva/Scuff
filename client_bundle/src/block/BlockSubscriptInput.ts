import type { IScruffrBlockInput } from "../scruffr/IScruffrBlockInput";
import type { ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "../scruffr/ScruffrBlockRef";
import { ScruffrInputSubscriptElement } from "../scruffr/ScruffrInputSubscriptElement";
import type { BlockInputType } from "./BlockInputType";
import { BlockScript } from "./BlockScript";


export class BlockSubscriptInput extends BlockScript {

    public render(parent: ScruffrBlockInstanceElement, parentRef: ScruffrBlockRef<BlockInputType>): IScruffrBlockInput {
        return new ScruffrInputSubscriptElement(parent, this);
    }

}
