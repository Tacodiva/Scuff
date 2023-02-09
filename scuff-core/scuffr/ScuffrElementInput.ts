import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { IScuffrPointAttachable } from "./attachment-points/ScuffrAttachmentPoint";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";

export interface ScuffrElementInput extends IScuffrPointAttachable, ScuffrElementBlockPart, ScuffrElement {
    asInput(): BlockInput;
    setParent(parentRef: ScuffrBlockReference<BlockPartInput<BlockInput>, ScuffrElementBlockContent>): void;
}