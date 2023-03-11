import type { ScuffrElementShape } from "./ScuffrElementShape";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrReferenceLink } from "./ScuffrReference";
import type { ScuffrReferenceBlockStackable } from "./ScuffrReferenceTypes";

export interface ScuffrElementBlock extends ScuffrElementShape<ScuffrElement>, ScuffrReferenceLink<any> {
    setParent(reference: ScuffrReferenceBlockStackable): void;
    onAncestryChange(root: ScuffrElementScriptRoot | null): void;

    shouldAttachUp(): boolean;
    shouldAttachDown(): boolean;
}
