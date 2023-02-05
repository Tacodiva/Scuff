import { ScruffrElement } from "./ScruffrElement";

export abstract class ScruffrParentElement extends ScruffrElement {
    public abstract children: readonly ScruffrElement[];

    public override updateAll(): void {
        for (const child of this.children)
            child.updateAll();
        super.updateAll();
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        for (const child of this.children)
            child.onTranslationUpdate();
    }
}
