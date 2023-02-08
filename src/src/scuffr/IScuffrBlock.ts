import type { BlockScript } from "../block/BlockScript";
import type { ScuffrBackgroundElement } from "./background/ScuffrBackgroundElement";
import type { ScuffrBlockRef } from "./ScuffrBlockRef";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import type { ScuffrScriptElement } from "./ScuffrScriptElement";


export interface IScuffrBlock extends ScuffrBackgroundElement<ScuffrElement> {
    get parentRef(): ScuffrBlockRef;
    setParent(parentRef: ScuffrBlockRef<number, ScuffrScriptElement>): void;
    onAncestryChange(root: ScuffrRootScriptElement | null): void;

    shouldAttachUp(): boolean;
    shouldAttachDown(): boolean;
}
