import { ScuffrElement } from "./ScuffrElement";

export abstract class ScuffrElementParent extends ScuffrElement {
    public abstract children: readonly ScuffrElement[];

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
