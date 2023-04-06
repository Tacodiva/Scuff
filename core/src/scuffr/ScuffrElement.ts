import type { Vec2 } from "../utils/Vec2";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";

export abstract class ScuffrElement<TDom extends Element = Element> {
    public static readonly DATA_NAME = "scuff-rendered-element";

    public readonly workspace: ScuffrWorkspace;
    public readonly dom: TDom;
    public abstract parent: ScuffrElementParent | null;

    public constructor(dom: TDom, workspace?: ScuffrWorkspace) {
        this.dom = dom;
        this.workspace = workspace ?? this._getWorkspace();

        (<any>this.dom)[ScuffrElement.DATA_NAME] = this;
    }

    protected _getWorkspace(): ScuffrWorkspace {
        throw new Error("No workspace provided in constructor and element did not override _getWorkspace()!");
    }

    public onClick(event: MouseEvent): boolean {
        return false;
    }

    public onRightClick(event: MouseEvent): boolean {
        return false;
    }

    public onDrag(event: MouseEvent): boolean {
        return false;
    }

    public onWheel(event: WheelEvent): boolean {
        return false;
    }

    public updateAll() {
        this.update(false);
    }

    public update(propagateUp: boolean) {
        if (propagateUp && this.parent) this.parent.update(true);
    }

    public getAbsoluteTranslation(): Vec2 {
        return { x: 0, y: 0 };
    }
}