import type { Vec2 } from "../utils/Vec2";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";

export abstract class ScuffrSvgElement extends ScuffrElement<SVGGraphicsElement> {

    public readonly scriptContainer : ScuffrElementScriptContainer;

    private readonly _domTranslation: SVGTransform;
    public dimensions: Vec2;
    public topLeftOffset: Vec2;

    public translationSelf: Vec2;
    public translationParent: Vec2;
    public get translationX() { return this.translationSelf.x + this.translationParent.x; }
    public get translationY() { return this.translationSelf.y + this.translationParent.y; }

    private _lastTranslationUpdate: Vec2;
    private _absoluteTranslation: Vec2 | null;

    public constructor(dom: SVGGraphicsElement, scriptContainer: ScuffrElementScriptContainer, translation: Vec2 = { x: 0, y: 0 }, dimensions: Vec2 = { x: 0, y: 0 }, topLeftOffset: Vec2 = { x: 0, y: 0 }, translationParent: Vec2 = { x: 0, y: 0 }) {
        super(dom, scriptContainer.workspace);
        this.scriptContainer = scriptContainer;
        this.dimensions = dimensions;
        this.topLeftOffset = topLeftOffset;

        this.translationSelf = translation;
        this.translationParent = translationParent;
        this._domTranslation = this.workspace.dom?.createSVGTransform();
        if (this._domTranslation) {
            this.dom.transform.baseVal.clear();
            this.dom.transform.baseVal.appendItem(this._domTranslation);
        }

        this._absoluteTranslation = null;
        this._lastTranslationUpdate = { x: NaN, y: NaN };
    }

    public updateTranslation(propgrateDown: boolean = true) {
        const x = this.translationX;
        const y = this.translationY;
        if (this._lastTranslationUpdate.x === x && this._lastTranslationUpdate.y === y)
            return;
        this._lastTranslationUpdate.x = x;
        this._lastTranslationUpdate.y = y;
        if (this._domTranslation)
            this._domTranslation.setTranslate(x, y);
        if (propgrateDown)
            this.onTranslationUpdate();
    }

    public onTranslationUpdate() {
        this._absoluteTranslation = null;
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

    public override getAbsoluteTranslation(): Vec2 {
        if (this._absoluteTranslation) return this._absoluteTranslation;
        return this._absoluteTranslation = this._calculateAbsoluteTranslation();
    }

    private _calculateAbsoluteTranslation(): Vec2 {
        if (!this.parent) return { x: this.translationX, y: this.translationY };
        const parentTrans = this.parent.getAbsoluteTranslation();
        return {
            x: this.translationX + parentTrans.x,
            y: this.translationY + parentTrans.y
        }
    }
}


