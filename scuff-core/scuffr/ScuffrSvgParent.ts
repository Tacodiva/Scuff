import type { ScuffrElement } from "./ScuffrElement";

export interface ScuffrElementParent<TDom extends Element = Element> extends ScuffrElement<TDom> {
    children: readonly ScuffrElement[];
}