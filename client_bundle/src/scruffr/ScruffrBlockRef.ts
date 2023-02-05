import type { ScruffrParentElement } from "./ScruffrParentElement";
import type { ScruffrBlockInstanceElement } from "./ScruffrBlockInstanceElement";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";

export interface IScruffrBlockParent<T = unknown> extends ScruffrParentElement  {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlockInstanceElement(key: T): ScruffrBlockInstanceElement | null;
    getRoot(): ScruffrRootScriptElement;
}

export class ScruffrBlockRef<TKey = unknown, TParent extends IScruffrBlockParent<TKey> = IScruffrBlockParent<TKey>> {
    public childKey: TKey;
    public readonly parent: TParent;

    public constructor(key: TKey, container: TParent) {
        this.childKey = key;
        this.parent = container;
    }

    public onDrag(event: MouseEvent): boolean {
        return (this.parent.onChildDrag && this.parent.onChildDrag(this.childKey, event)) ?? false;
    }

    public get(): ScruffrBlockInstanceElement {
        const block = this.parent.getBlockInstanceElement(this.childKey);
        if (!block)
            throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}
