import type { IScuffrBlockInput } from "../scuffr/IScuffrBlockInput";
import type { ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "../scuffr/ScuffrBlockRef";
import { ScuffrInputSubscriptElement } from "../scuffr/ScuffrInputSubscriptElement";
import type { BlockInputType } from "./BlockInputType";
import { BlockScript } from "./BlockScript";


export class BlockSubscriptInput extends BlockScript {

    public render(parent: ScuffrBlockInstanceElement, parentRef: ScuffrBlockRef<BlockInputType>): IScuffrBlockInput {
        return new ScuffrInputSubscriptElement(parent, this);
    }

}
