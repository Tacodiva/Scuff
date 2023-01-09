import type { Vec2 } from "../utils/Vec2";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";

abstract class ScuffrElement {
    public static readonly DATA_NAME = "sfs-rendered-element";

    public readonly workspace: ScuffrWorkspace;

    public readonly dom: SVGElement;
    public dimensions: Vec2;
    public topLeftOffset: Vec2;

    public translationSelf: Vec2;
    public translationParent: Vec2;
    public get translationX() { return this.translationSelf.x + this.translationParent.x; }
    public get translationY() { return this.translationSelf.y + this.translationParent.y; }

    public abstract parent: ScuffrParentElement | null;

    public constructor(dom: SVGElement, workspace?: ScuffrWorkspace, translation: Vec2 = { x: 0, y: 0 }, dimensions: Vec2 = { x: 0, y: 0 }, topLeftOffset: Vec2 = { x: 0, y: 0 }, translationParent: Vec2 = { x: 0, y: 0 }) {
        this.workspace = workspace ?? this._getWorkspace();
        this.dom = dom;
        this.translationSelf = translation;
        this.dimensions = dimensions;
        this.topLeftOffset = topLeftOffset;
        this.translationParent = translationParent;

        (<any>this.dom)[ScuffrElement.DATA_NAME] = this;
    }

    public getAbsoluteTranslation(): Vec2 {
        if (!this.parent) return { x: this.translationX, y: this.translationY };
        const parentTrans = this.parent.getAbsoluteTranslation();
        return {
            x: this.translationX + parentTrans.x,
            y: this.translationY + parentTrans.y
        }
    }

    protected _getWorkspace(): ScuffrWorkspace {
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
        this.dom.setAttribute("transform", `translate(${this.translationX}, ${this.translationY})`)
        this.onTranslationUpdate();
    }

    public onTranslationUpdate() { }

    public updateAll() {
        this.update(false);
    }

    public update(propagateUp: boolean) {
        if (propagateUp && this.parent) this.parent.update(true);
    }

    public get topOffset() {
        return -this.topLeftOffset.y;
    }

    public get bottomOffset() {
        return this.dimensions.y + this.topOffset;
    }

    public get leftOffset() {
        return -this.topLeftOffset.x;
    }

    public get rightOffset() {
        return this.dimensions.x + this.leftOffset;
    }
}

abstract class ScuffrParentElement extends ScuffrElement {
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

export { ScuffrParentElement, ScuffrElement }