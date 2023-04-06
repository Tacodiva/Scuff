import type { ScuffrSvgShape } from "./ScuffrSvgShape";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrReferenceLink } from "../ScuffrReference";
import type { ScuffrReferenceBlockStackable } from "../ScuffrReferenceTypes";

export interface ScuffrSvgBlock extends ScuffrSvgShape<ScuffrSvgElement>, ScuffrReferenceLink<any> {
    setParent(reference: ScuffrReferenceBlockStackable): void;
    onAncestryChange(root: ScuffrSvgScriptRoot | null): void;

    shouldAttachUp(): boolean;
    shouldAttachDown(): boolean;
}
