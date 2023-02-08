import type { ScuffrParentElement } from "./ScuffrParentElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import type { IScuffrBlock } from "./IScuffrBlock";

export interface IScuffrBlockParent<T = unknown> extends ScuffrParentElement  {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlockElement(key: T): IScuffrBlock | null;
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

    public get(): IScuffrBlock {
        const block = this.parent.getBlockElement(this.childKey);
        if (!block)
            throw new Error("Invalid parent reference, couldn't find child with key on parent.");
        return block;
    }
}
