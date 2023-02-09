import type { BlockScript } from "../block/BlockScript";
import type { ScuffrElementShape } from "./ScuffrElementShape";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrElementScript } from "./ScuffrElementScript";


export interface ScuffrElementBlock extends ScuffrElementShape<ScuffrElement> {
    get parentRef(): ScuffrBlockReference;
    setParent(parentRef: ScuffrBlockReference<number, ScuffrElementScript>): void;
    onAncestryChange(root: ScuffrElementScriptRoot | null): void;

    shouldAttachUp(): boolean;
    shouldAttachDown(): boolean;
}
