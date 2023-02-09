import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";

export interface ScuffrBlockReferenceParent<T = unknown> extends ScuffrElementParent  {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlockElement(key: T): ScuffrElementBlock | null;
    getRoot(): ScuffrElementScriptRoot;
}

export class ScuffrBlockReference<TKey = unknown, TParent extends ScuffrBlockReferenceParent<TKey> = ScuffrBlockReferenceParent<TKey>> {
    public childKey: TKey;
    public readonly parent: TParent;

    public constructor(key: TKey, container: TParent) {
        this.childKey = key;
        this.parent = container;
    }

    public onDrag(event: MouseEvent): boolean {
        return (this.parent.onChildDrag && this.parent.onChildDrag(this.childKey, event)) ?? false;
    }

    public get(): ScuffrElementBlock {
        const block = this.parent.getBlockElement(this.childKey);
        if (!block)
            throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}
