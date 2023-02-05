import type { IScuffrBackgroundModifier, ScuffrBackground } from "./background/ScuffrBackground";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";

export interface IScuffrBlockPartElement extends ScuffrElement {
    getBackground?(): ScuffrBackground | null;
    getBackgroundModifier?(): IScuffrBackgroundModifier | null;
    onAncestryChange?(root: ScuffrRootScriptElement | null): void;
}
