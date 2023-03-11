import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import { ScuffrElementScriptInput } from "../scuffr/ScuffrElementScriptInput";
import { BlockScript } from "./BlockScript";
import type { BlockInput } from "./BlockInput";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";


export class BlockScriptInput extends BlockScript implements BlockInput {

    public render(reference: ScuffrReferenceInput): ScuffrElementInput {
        return new ScuffrElementScriptInput(reference, this);
    }

    public clone(): BlockScriptInput {
        return new BlockScriptInput(this._clone());
    }
}
