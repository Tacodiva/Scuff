import type { ScuffrElementBlockContent } from ".";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrElementScript } from "./ScuffrElementScript";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrLinkReference, ScuffrReferenceable, ScuffrReferenceLink } from "./ScuffrReference";

export interface ScuffrReferenceParentBlock<TChild extends ScuffrReferenceable = ScuffrReferenceable> extends ScuffrElementParent, ScuffrReferenceLink<TChild> {
    onChildDrag?(index: number, event: MouseEvent): boolean;
    getRoot(): ScuffrElementScriptRoot;
}

export type ScuffrReferenceInput = ScuffrLinkReference<ScuffrElementInput, ScuffrElementBlockContent & ScuffrReferenceParentBlock<ScuffrElementInput>>;
export type ScuffrReferenceBlockStackable = ScuffrLinkReference<ScuffrElementBlock, ScuffrElementScript & ScuffrReferenceParentBlock<ScuffrElementBlock>>;
export type ScuffrReferenceBlock = ScuffrReferenceInput | ScuffrReferenceBlockStackable;
