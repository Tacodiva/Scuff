import type { IScruffrBackgroundModifier, ScruffrBackground } from "./background/ScruffrBackground";
import type { ScruffrElement } from "./ScruffrElement";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";

export interface IScruffrBlockPartElement extends ScruffrElement {
    getBackground?(): ScruffrBackground | null;
    getBackgroundModifier?(): IScruffrBackgroundModifier | null;
    onAncestryChange?(root: ScruffrRootScriptElement | null): void;
}
