import type { ScuffrSvgScriptRoot, ScuffrWorkspace } from ".";

export interface ScuffrReferenceable {
    getReference(): ScuffrReference;
}

export interface ScuffrReference<TValue extends ScuffrReferenceable = ScuffrReferenceable> {
    index: number;
    parent: ScuffrReferenceParent<TValue>;
}

export interface ScuffrRootReference extends ScuffrReference<ScuffrSvgScriptRoot> {
    index: number;
    parent: ScuffrWorkspace;
}

export interface ScuffrLinkReference<TValue extends ScuffrReferenceable, TParent extends ScuffrReferenceLink<TValue>> extends ScuffrReference<TValue> {
    index: number;
    parent: TParent;
}

interface ScuffrReferenceParentMethod<TChild extends ScuffrReferenceable> {
    getReferenceValue(index: number): TChild;
}

export type ScuffrReferenceLink<TChild extends ScuffrReferenceable> = ScuffrReferenceable & ScuffrReferenceParentMethod<TChild>;
export type ScuffrReferenceParent<T extends ScuffrReferenceable> = (ScuffrWorkspace & ScuffrReferenceParentMethod<T>) | ScuffrReferenceLink<T>;
