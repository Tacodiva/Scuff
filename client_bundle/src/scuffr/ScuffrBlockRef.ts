import type { ScuffrParentElement } from "./ScuffrElement";
import type { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import type { ScuffrRootScriptElement } from "./ScuffrScriptElement";

export interface IScuffrBlockParent<T = unknown> extends ScuffrParentElement  {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlock(key: T): ScuffrBlockInstanceElement | null;
    getRoot(): ScuffrRootScriptElement;
}

export class ScuffrBlockRef<TKey = unknown, TParent extends IScuffrBlockParent<TKey> = IScuffrBlockParent<TKey>> {
    public childKey: TKey;
    public readonly parent: TParent;

    public constructor(key: TKey, container: TParent) {
        this.childKey = key;
        this.parent = container;
    }

    public onDrag(event: MouseEvent): boolean {
        return (this.parent.onChildDrag && this.parent.onChildDrag(this.childKey, event)) ?? false;
    }

    public get(): ScuffrBlockInstanceElement {
        const block = this.parent.getBlock(this.childKey);
        if (!block)
            throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}
