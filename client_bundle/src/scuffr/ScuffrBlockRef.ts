import type { ScuffrParentElement } from "./ScuffrElement";
import type { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";

export interface IScuffrBlockParent<T = unknown> extends ScuffrParentElement  {
    onChildDrag?(key: T, event: MouseEvent): boolean;
    getBlock(key: T): ScuffrBlockInstanceElement | null;
    getRoot(): ScuffrRootScriptElement;
}

export class ScuffrBlockRef<T = unknown> {
    public childKey: T;
    public readonly parent: IScuffrBlockParent<T>;

    public constructor(key: T, container: IScuffrBlockParent<T>) {
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
