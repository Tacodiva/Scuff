import type { ScuffrSvgBlockContent } from ".";
import type { ScuffrSvgBlock } from "./svg/ScuffrSvgBlock";
import type { ScuffrSvgInput } from "./svg/ScuffrSvgInput";
import type { ScuffrSvgElementParent } from "./svg/ScuffrSvgElementParent";
import type { ScuffrSvgScript } from "./svg/ScuffrSvgScript";
import type { ScuffrSvgScriptRoot } from "./svg/ScuffrSvgScriptRoot";
import type { ScuffrLinkReference, ScuffrReferenceable, ScuffrReferenceLink } from "./ScuffrReference";
import type { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";

export interface ScuffrReferenceParentBlock<TChild extends ScuffrReferenceable = ScuffrReferenceable> extends ScuffrSvgElementParent, ScuffrReferenceLink<TChild> {
    onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean;
    getRoot(): ScuffrSvgScriptRoot;
    scriptContainer: ScuffrElementScriptContainer
}

export type ScuffrReferenceInput = ScuffrLinkReference<ScuffrSvgInput, ScuffrSvgBlockContent & ScuffrReferenceParentBlock<ScuffrSvgInput>>;
export type ScuffrReferenceBlockStackable = ScuffrLinkReference<ScuffrSvgBlock, ScuffrSvgScript & ScuffrReferenceParentBlock<ScuffrSvgBlock>>;
export type ScuffrReferenceBlock = ScuffrReferenceInput | ScuffrReferenceBlockStackable;
