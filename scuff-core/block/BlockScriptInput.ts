import type { ScuffrSvgInput } from "../scuffr/ScuffrSvgInput";
import { ScuffrSvgScriptInput } from "../scuffr/ScuffrSvgScriptInput";
import { BlockScript } from "./BlockScript";
import type { BlockInput } from "./BlockInput";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";


export class BlockScriptInput extends BlockScript implements BlockInput {

    public render(reference: ScuffrReferenceInput): ScuffrSvgInput {
        return new ScuffrSvgScriptInput(reference, this);
    }

    public clone(): BlockScriptInput {
        return new BlockScriptInput(this._clone());
    }
}
