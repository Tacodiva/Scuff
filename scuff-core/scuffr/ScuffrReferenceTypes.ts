import type { ScuffrSvgBlockContent } from ".";
import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import type { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import type { ScuffrSvgScript } from "./ScuffrSvgScript";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrLinkReference, ScuffrReferenceable, ScuffrReferenceLink } from "./ScuffrReference";

export interface ScuffrReferenceParentBlock<TChild extends ScuffrReferenceable = ScuffrReferenceable> extends ScuffrSvgElementParent, ScuffrReferenceLink<TChild> {
    onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean;
    getRoot(): ScuffrSvgScriptRoot;
}

export type ScuffrReferenceInput = ScuffrLinkReference<ScuffrSvgInput, ScuffrSvgBlockContent & ScuffrReferenceParentBlock<ScuffrSvgInput>>;
export type ScuffrReferenceBlockStackable = ScuffrLinkReference<ScuffrSvgBlock, ScuffrSvgScript & ScuffrReferenceParentBlock<ScuffrSvgBlock>>;
export type ScuffrReferenceBlock = ScuffrReferenceInput | ScuffrReferenceBlockStackable;
