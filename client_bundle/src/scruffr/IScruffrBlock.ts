import type { BlockScript } from "../block/BlockScript";
import type { ScruffrBackgroundElement } from "./background/ScruffrBackgroundElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import type { ScruffrElement } from "./ScruffrElement";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";
import type { ScruffrScriptElement } from "./ScruffrScriptElement";


export interface IScruffrBlock extends ScruffrBackgroundElement<ScruffrElement> {
    get parentRef(): ScruffrBlockRef;
    setParent(parentRef: ScruffrBlockRef<number, ScruffrScriptElement<BlockScript>>): void;
    onAncestryChange(root: ScruffrRootScriptElement | null): void;

    shouldAttachUp(): boolean;
    shouldAttachDown(): boolean;
}
