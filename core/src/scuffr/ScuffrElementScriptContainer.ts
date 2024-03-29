import { writable } from "svelte/store";
import type { ScuffEditorScrollableArea, ScuffEditorScrollableAreaData } from "../editor/scrollbar/ScuffEditorScrollableArea";
import { Bounds } from "../utils/Bounds";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrRootReference } from "./ScuffrReference";
import type { ScuffrSvgBlock } from "./svg/ScuffrSvgBlock";
import type { ScuffrSvgScriptRoot } from "./svg/ScuffrSvgScriptRoot";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import type { BlockInstance } from "../block";

export abstract class ScuffrElementScriptContainer extends ScuffrElement<SVGElement> implements ScuffrElementParent {
    public abstract children: ScuffrSvgScriptRoot[];

    public readonly scriptsDom: SVGGElement;

    public contentTranslation: Vec2;
    public contentScale: number;

    protected readonly svgTranslation: SVGTransform;
    protected readonly svgScale: SVGTransform;

    public readonly scrollPane: ScuffEditorScrollableArea;
    protected _scrollTopLeft: Vec2;
    protected _scrollBottomRight: Vec2;
    protected _scrollEnforceBounds: boolean;

    private _bounds: Bounds;
    public get bounds() { return this._bounds };

    public constructor(workspace: ScuffrWorkspace, dom?: SVGElement) {
        super(dom ?? workspace.dom.appendChild(document.createElementNS(SVG_NS, "g")), workspace);

        this.contentTranslation = { x: 0, y: 0 };
        this.contentScale = 1;
        this._bounds = Bounds.Zero;

        this.scriptsDom = this.dom.appendChild(document.createElementNS(SVG_NS, "g"));
        this.svgScale = this.workspace.dom.createSVGTransform();
        this.scriptsDom.transform.baseVal.appendItem(this.svgScale);
        this.svgTranslation = this.workspace.dom.createSVGTransform();
        this.scriptsDom.transform.baseVal.appendItem(this.svgTranslation);

        this.scrollPane = writable();
        this.scrollPane.subscribe(pane => {
            if (pane) {
                this.contentTranslation.x = -pane.viewportTopLeft.x;
                this.contentTranslation.y = -pane.viewportTopLeft.y;
                this.updateContentTransformDOM();
            }
        });
        this._scrollTopLeft = { x: 0, y: 0 };
        this._scrollBottomRight = { x: 0, y: 0 };
        this._scrollEnforceBounds = false;
    }

    public getScriptReference(script: ScuffrSvgScriptRoot): ScuffrRootReference {
        return { index: this.children.indexOf(script), parent: this };
    }

    public getReferenceValue(index: number): ScuffrSvgScriptRoot {
        return this.children[index];
    }

    protected updateContentTransformDOM() {
        this.svgScale.setScale(this.contentScale, this.contentScale);
        this.svgTranslation.setTranslate(this.contentTranslation.x, this.contentTranslation.y);
    }

    public updateContentTransform() {
        this._setScrollPane({
            contentTopLeft: this._scrollTopLeft,
            contentBottomRight: this._scrollBottomRight,
            viewportTopLeft: {
                x: -this.contentTranslation.x,
                y: -this.contentTranslation.y
            },
            viewportBottomRight: {
                x: this._bounds.width / this.contentScale - this.contentTranslation.x,
                y: this._bounds.height / this.contentScale - this.contentTranslation.y
            },
            domSize: {
                x: this._bounds.width,
                y: this._bounds.height
            },
            enforceBounds: this._scrollEnforceBounds
        });
    }

    protected _setScrollPane(scroll: ScuffEditorScrollableAreaData) {
        this.scrollPane.set(scroll);
    }

    public toWorkspaceCoords(pos: Vec2): Vec2 {
        return {
            x: (pos.x - this._bounds.x) / this.contentScale - this.contentTranslation.x,
            y: (pos.y - this._bounds.y) / this.contentScale - this.contentTranslation.y
        };
    }

    public toViewportCoords(pos: Vec2): Vec2 {
        return {
            x: (pos.x + this.contentTranslation.x) * this.contentScale + this._bounds.x,
            y: (pos.y + this.contentTranslation.y) * this.contentScale + this._bounds.y
        }
    }

    public setBounds(bounds: Bounds) {
        this._bounds = bounds;
        this.updateScrollPane();
    }

    public updateScrollPane() {
        const bounds = this._getContentBounds();
        this._scrollTopLeft = this.toWorkspaceCoords({ x: bounds.x, y: bounds.y });
        this._scrollBottomRight = this.toWorkspaceCoords({ x: bounds.x + bounds.width, y: bounds.y + bounds.height });

        this.updateContentTransform();
    }

    protected _getContentBounds(): Bounds {
        return this.scriptsDom.getBoundingClientRect();
    }

    public getSelectedScript(): ScuffrSvgScriptRoot {
        return this.children[this, this.children.length - 1];
    }

    public swapSelected(index: number): ScuffrSvgScriptRoot {
        if (index === this.children.length - 1)
            return this.getSelectedScript();

        const currentSelect = this.children[this.children.length - 1];
        const newSelect = this.children[index];

        this.children[index] = currentSelect;
        this.children[this.children.length - 1] = newSelect;

        return this.getSelectedScript();
    }

    public renderScript(blocks: BlockInstance[], translation?: Vec2): ScuffrSvgScriptRoot {
        throw new Error("Operation not supported.");
    }

    public createScript(blocks?: ScuffrSvgBlock[], translation?: Vec2): ScuffrSvgScriptRoot {
        throw new Error("Operation not supported.");
    }

    public deleteScript(script: ScuffrSvgScriptRoot, deleteBlocks: boolean = true) {
        throw new Error("Operation not supported.");
    }

    public getAttachmentPoints(): Iterable<ScuffrAttachmentPointList> {
        return [];
    }

    public addAttachmentPoints(points: ScuffrAttachmentPointList): void { }
    public deleteAttachmentPoints(points: ScuffrAttachmentPointList): void { }
}