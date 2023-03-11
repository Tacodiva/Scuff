import type { ScuffrWorkspace } from ".";

export interface ScuffrReferenceable {
    getReference(): ScuffrReference<any>;
}

export interface ScuffrReference<TValue extends ScuffrReferenceable> {
    index: number;
    parent: ScuffrReferenceParent<TValue>;
}

export interface ScuffrLinkReference<TValue extends ScuffrReferenceable, TParent extends ScuffrReferenceLink<TValue>> extends ScuffrReference<TValue> {
    index: number;
    parent: TParent;
}

export interface ScuffrReferenceLink<TChild extends ScuffrReferenceable> extends ScuffrReferenceable {
    getIndexValue(index: number): TChild;
}

export type ScuffrReferenceParent<T extends ScuffrReferenceable> = ScuffrWorkspace | ScuffrReferenceLink<T>;
