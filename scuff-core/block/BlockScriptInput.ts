import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import { ScuffrElementScriptInput } from "../scuffr/ScuffrElementScriptInput";
import type { BlockPartInput } from "./BlockPartInput";
import { BlockScript } from "./BlockScript";
import type { BlockInput } from "./BlockInput";


export class BlockScriptInput extends BlockScript implements BlockInput {

    public render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput>): ScuffrElementInput {
        return new ScuffrElementScriptInput(parent, this);
    }

}