import type { Vec2 } from "../../utils/Vec2";
import type { SVGRenderedWorkspace } from "./SVGWorkspace";

abstract class ScuffrElement {
    public static readonly DATA_NAME = "sfs-rendered-element";

    public readonly workspace: SVGRenderedWorkspace;

    public readonly dom: SVGElement;
    public dimensions: Vec2;
    public translation: Vec2;

    public abstract parent: ScuffrParentElement | null;

    public constructor(dom: SVGElement, translation: Vec2, dimensions: Vec2, workspace?: SVGRenderedWorkspace) {
        this.workspace = workspace ?? this._getWorkspace();
        this.dom = dom;
        this.translation = translation;
        this.dimensions = dimensions;

        (<any>this.dom)[ScuffrElement.DATA_NAME] = this;
    }

    public getAbsoluteTranslation(): Vec2 {
        if (!this.parent) return this.translation;
        const parentTrans = this.parent.getAbsoluteTranslation();
        return {
            x: this.translation.x + parentTrans.x,
            y: this.translation.y + parentTrans.y
        }
    }

    protected _getWorkspace(): SVGRenderedWorkspace {
        if (this.parent) return this.parent.workspace;
        throw new Error("No workspace provided in constructor and element did not override _getWorkspace()!");
    }

    public onClick(event: MouseEvent): boolean {
        return false;
    }

    public onDrag(event: MouseEvent): boolean {
        return false;
    }

    public onWheel(event: WheelEvent): boolean {
        return false;
    }

    public updateTraslation() {
        this.dom.setAttribute("transform", `translate(${this.translation.x}, ${this.translation.y})`)
    }
}

abstract class ScuffrParentElement extends ScuffrElement {
    public abstract children : readonly ScuffrElement[];

    public update(child : ScuffrElement) {
        if (!this.parent)
            throw new Error("Failed to update element. Reached root node.");
        this.parent.update(this);
    }
}

class ScuffrElementImpl extends ScuffrElement {
    public override parent: ScuffrParentElement;

    constructor(parent: ScuffrParentElement, dom: SVGElement, translation: Vec2, dimensions: Vec2) {
        super(dom, translation, dimensions, parent.workspace);
        this.parent = parent;
    }
}

export { ScuffrParentElement, ScuffrElement, ScuffrElementImpl }