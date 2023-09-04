import type { ScuffrElementParent } from "../ScuffrElementParent";
import { ScuffrSvgElement } from "./ScuffrSvgElement";

export abstract class ScuffrSvgElementParent extends ScuffrSvgElement implements ScuffrElementParent<SVGGraphicsElement> {
    public abstract children: readonly ScuffrSvgElement[];

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
