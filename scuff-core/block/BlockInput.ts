import type { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockPartInput } from "./BlockPartInput";

export interface BlockInput {
    render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput>): ScuffrElementInput;
    clone() : BlockInput;
}
