import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import { ScuffrElement } from "./ScuffrElement";
import { ScuffrElementParent } from "./ScuffrElementParent";
import type { BlockScripts } from "../block/BlockScripts";
import type { BlockInstance } from "../block/BlockInstance";
import type { ScuffrElementInputLiteral } from "./ScuffrElementInputLiteral";
import { ScuffrAttachmentPointScript } from "./attachment-points/ScuffrAttachmentPointScript";
import { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrAttachmentPointScriptTop } from "./attachment-points/ScuffrAttachmentPointScriptTop";
import { ScuffrTextSizeCache } from "./ScuffrTextSizeCache";
import type { ScrollablePane } from "../editor/scrollbar/ScrollablePaneInfo";
import { writable } from "svelte/store";
import type { ScuffrElementInputDropdown } from "./ScuffrElementInputDropdown";
import { ScuffrInteractionPanning } from "./interactions/ScuffrInteractionPanning";
import { ScuffrInteractionDragScript } from "./interactions/ScuffrInteractionDragScript";
import { ScuffrInteractionLiteralEdit } from "./interactions/ScuffrInteractionLiteralEdit";
import { ScuffrInteractionDropdown } from "./interactions/ScuffrInteractionDropdown";
import type { ScuffrInteraction } from "./interactions/ScuffrInteraction";

export class ScuffrWorkspace extends ScuffrElementParent {
    public parent: null;

    public readonly blockScripts: BlockScripts;
    public children: ScuffrElementScriptRoot[];

    public readonly svg: SVGSVGElement;

    public readonly svgScriptContainer: SVGGElement;
    public readonly svgBackgroundPattern: SVGPatternElement;
    public readonly svgBackgroundElement: SVGRectElement;
    public readonly svgDebug: SVGElement;

    public readonly svgScriptTranformTranslate: SVGTransform;
    public readonly svgScriptTranformScale: SVGTransform;
    public readonly svgBackgroundTranformTranslate: SVGTransform;
    public readonly svgBackgroundTranformScale: SVGTransform;

    public readonly scrollPane: ScrollablePane;
    private readonly _scrollTopLeft: Vec2;
    private readonly _scrollBottomRight: Vec2;

    public readonly attachmentPoints: Set<ScuffrAttachmentPointList>;

    private readonly _textSizeCache: ScuffrTextSizeCache;

    private _interaction: ScuffrInteraction | null;
    private _mouseDownPos: Vec2 | null;

    public constructor(root: SVGSVGElement, svgWorkspace: SVGGElement, backgroundPattern: SVGPatternElement, blockScripts: BlockScripts) {
        super(svgWorkspace);
        (<any>window).workspace = this;
        this.parent = null;

        this.blockScripts = blockScripts;
        this.children = [];
        this.attachmentPoints = new Set();
        this._textSizeCache = new ScuffrTextSizeCache(this);

        this.svg = root;

        this.svgBackgroundPattern = backgroundPattern;
        this.svgBackgroundElement = svgWorkspace.appendChild(document.createElementNS(SVG_NS, "rect"));
        this.svgBackgroundElement.setAttribute("width", "100%");
        this.svgBackgroundElement.setAttribute("height", "100%");
        this.svgBackgroundElement.style.fill = `url("#${backgroundPattern.id}")`;

        this.svgScriptContainer = svgWorkspace.appendChild(document.createElementNS(SVG_NS, "g"));

        this.svgDebug = this.svgScriptContainer.appendChild(document.createElementNS(SVG_NS, "g"));

        this._interaction = null;
        this._mouseDownPos = null;

        this.svgScriptTranformScale = root.createSVGTransform();
        this.svgScriptContainer.transform.baseVal.appendItem(this.svgScriptTranformScale);
        this.svgScriptTranformTranslate = root.createSVGTransform();
        this.svgScriptContainer.transform.baseVal.appendItem(this.svgScriptTranformTranslate);

        this.svgBackgroundTranformScale = root.createSVGTransform();
        this.svgBackgroundPattern.patternTransform.baseVal.appendItem(this.svgBackgroundTranformScale);
        this.svgBackgroundTranformTranslate = root.createSVGTransform();
        this.svgBackgroundPattern.patternTransform.baseVal.appendItem(this.svgBackgroundTranformTranslate);

        for (const script of this.blockScripts.scripts) {
            const rendered = new ScuffrElementScriptRoot(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }

        this.scrollPane = writable();
        this.scrollPane.subscribe(pane => {
            if (pane) {
                this.blockScripts.transformPosition.x = -pane.scroll.x;
                this.blockScripts.transformPosition.y = -pane.scroll.y;
                this._updateGlobalTransformDOM();
            }
        });
        this._scrollTopLeft = { x: 0, y: 0 };
        this._scrollBottomRight = { x: 0, y: 0 };

        this.findWorkspaceCorners();
    }

    public debugRender() {
        this.svgDebug.innerHTML = "";
        this.svgScriptContainer.appendChild(this.svgDebug);
        for (const list of this.attachmentPoints) {
            for (const point of list.list) {
                const pointElement = this.svgDebug.appendChild(document.createElementNS(SVG_NS, "circle"));
                pointElement.setAttribute("r", "10");
                if (point instanceof ScuffrAttachmentPointScriptTop)
                    pointElement.setAttribute("style", "fill: #fff;");
                else if (point instanceof ScuffrAttachmentPointScript)
                    pointElement.setAttribute("style", "fill: #ff0000a0;");
                else
                    pointElement.setAttribute("style", "fill: #00ff00a0;");
                const pointPos = point.translation;
                pointElement.setAttribute("transform", `translate(${point.root.translationX + pointPos.x}, ${point.root.translationY + pointPos.y})`);
            }
        }
        for (const script of this.children) {
            const pointElement = this.svgDebug.appendChild(document.createElementNS(SVG_NS, "circle"));
            pointElement.setAttribute("r", "10");
            pointElement.setAttribute("style", "fill: #0000ffa0;");
            const pointPos = script.getAbsoluteTranslation();
            pointElement.setAttribute("transform", `translate(${pointPos.x}, ${pointPos.y})`);
        }
    }

    public debugCheck() {
        this.svgDebug.remove();
        let beforeElements = this.svgScriptContainer.getElementsByTagName("*").length;
        let beforePointLists = this.attachmentPoints.size;
        let beforePoints = 0;
        for (const pl of this.attachmentPoints) beforePoints += pl.list.length;
        for (const script of this.children)
            script.dom.remove();
        this.children.length = 0;
        this.attachmentPoints.clear();
        for (const script of this.blockScripts.scripts) {
            const rendered = new ScuffrElementScriptRoot(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }
        let afterElements = this.svgScriptContainer.getElementsByTagName("*").length;
        let afterPointLists = this.attachmentPoints.size;
        let afterPoints = 0;
        for (const pl of this.attachmentPoints) afterPoints += pl.list.length;
        if (beforeElements === afterElements) console.log(`Elements OK ${beforeElements}`);
        else console.error(`Elements FAIL ${beforeElements} -> ${afterElements}`);
        if (beforePointLists === afterPointLists) console.log(`Point List Count OK ${beforePointLists}`);
        else console.error(`Point List Count FAIL ${beforePointLists} -> ${afterPointLists}`);
        if (beforePoints === afterPoints) console.log(`Point Count OK ${beforePoints}`);
        else console.error(`Point Count FAIL ${beforePoints} -> ${afterPoints}`);
    }

    public addScript(script: BlockScriptRoot): ScuffrElementScriptRoot {
        const rendered = new ScuffrElementScriptRoot(this, script);
        rendered.updateAll();
        this.addRenderedScript(rendered);
        return rendered;
    }

    public addRenderedScript(script: ScuffrElementScriptRoot) {
        this.blockScripts.scripts.push(script.script);
        this.children.push(script);
    }

    public deleteScript(script: BlockScriptRoot, deleteBlocks?: boolean): boolean {
        return this._deleteScriptAt(this.blockScripts.scripts.indexOf(script), deleteBlocks);
    }

    public deleteRenderedScript(script: ScuffrElementScriptRoot, deleteBlocks?: boolean): boolean {
        return this._deleteScriptAt(this.children.indexOf(script), deleteBlocks);
    }

    public getRenderedScript(script: BlockScriptRoot): ScuffrElementScriptRoot {
        const rendered = this.children.find(rendered => rendered.script === script);
        if (!rendered) throw new Error("Script not a part of this workspace.");
        return rendered;
    }

    private _deleteScriptAt(idx: number, deleteBlocks: boolean = true): boolean {
        if (idx === -1) return false;
        this.blockScripts.scripts.splice(idx, 1);
        const script = this.children.splice(idx, 1)[0];
        script.attachmentPoints.delete();
        script.dom.remove();
        if (deleteBlocks) for (const child of script.children)
            child.onAncestryChange(null);
        return true;
    }

    public dragBlock(block: BlockInstance, mousePos: Vec2) {
        const script = new BlockScriptRoot([block]);
        const renderedScript = this.addScript(script);
        let pos = this.toWorkspaceCoords(mousePos);
        pos.x -= renderedScript.dimensions.x / 2;
        pos.y -= renderedScript.dimensions.y / 2;
        renderedScript.translationSelf = pos;
        renderedScript.updateTranslation();
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragRenderedBlock(block: ScuffrElementBlockInstance, mousePos: Vec2) {
        const translation = block.getAbsoluteTranslation();
        const renderedScript = new ScuffrElementScriptRoot(this, null, [block], { x: translation.x + block.leftOffset, y: translation.y });
        this.addRenderedScript(renderedScript);
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragScript(script: BlockScriptRoot, mousePos: Vec2) {
        this.dragRenderedScript(this.getRenderedScript(script), mousePos);
    }

    public dragRenderedScript(script: ScuffrElementScriptRoot, mousePos: Vec2) {
        this.startInteraction(new ScuffrInteractionDragScript(this, script, mousePos));
        // Move the script to the bottom of the container so it renders on top of everything else
        this.svgScriptContainer.appendChild(script.dom);
    }

    public editLiteralInput(input: ScuffrElementInputLiteral) {
        this.startInteraction(new ScuffrInteractionLiteralEdit(this, input));
    }

    public openDropdown(input: ScuffrElementInputDropdown) {
        this.startInteraction(new ScuffrInteractionDropdown(this, input));
    }

    public toWorkspaceCoords(pos: Vec2): Vec2 {
        return {
            x: pos.x / this.blockScripts.transformScale - this.blockScripts.transformPosition.x,
            y: pos.y / this.blockScripts.transformScale - this.blockScripts.transformPosition.y
        };
    }

    public toViewportCoords(pos: Vec2): Vec2 {
        return {
            x: (pos.x + this.blockScripts.transformPosition.x) * this.blockScripts.transformScale,
            y: (pos.y + this.blockScripts.transformPosition.y) * this.blockScripts.transformScale
        }
    }

    protected override _getWorkspace(): ScuffrWorkspace {
        return this;
    }

    public override onDrag(startPosition: Vec2): boolean {
        this.startInteraction(new ScuffrInteractionPanning(this, startPosition));
        return true;
    }

    public override onWheel(event: WheelEvent): boolean {
        if (event.ctrlKey) {
            const deltaY = event.deltaY > 0 ? 0.8 : 1.2;

            const newScale = this.blockScripts.transformScale * deltaY;

            this.blockScripts.transformPosition.x +=
                event.x / newScale - event.x / this.blockScripts.transformScale;
            this.blockScripts.transformPosition.y +=
                event.y / newScale - event.y / this.blockScripts.transformScale;
            this.blockScripts.transformScale = newScale;

            this.updateGlobalTransform();
            event.preventDefault();
            return true;
        }
        return false;
    }

    public findWorkspaceCorners() {
        this._scrollTopLeft.x = 0;
        this._scrollTopLeft.y = 0;
        this._scrollBottomRight.x = 0;
        this._scrollBottomRight.y = 0;
        for (const script of this.children) {
            const scriptTrans = script.getAbsoluteTranslation();
            if (scriptTrans.x > this._scrollBottomRight.x)
                this._scrollBottomRight.x = scriptTrans.x;

            if (scriptTrans.y + script.bottomOffset > this._scrollBottomRight.y)
                this._scrollBottomRight.y = scriptTrans.y + script.bottomOffset;

            if (scriptTrans.x < this._scrollTopLeft.x)
                this._scrollTopLeft.x = scriptTrans.x;

            if (scriptTrans.y + script.topOffset < this._scrollTopLeft.y)
                this._scrollTopLeft.y = scriptTrans.y + script.topOffset;
        }
        const scrollPadding = 2500;
        this._scrollTopLeft.x -= scrollPadding;
        this._scrollTopLeft.y -= scrollPadding;
        this._scrollBottomRight.x += scrollPadding;
        this._scrollBottomRight.y += scrollPadding;
        this.updateGlobalTransform();
    }

    public updateGlobalTransform() {
        const svgBounds = this.svg.getBoundingClientRect();
        const translation = this.blockScripts.transformPosition;
        this.scrollPane.set({
            contentTopLeft: this._scrollTopLeft,
            contentBottomRight: this._scrollBottomRight,
            clientSize: { x: svgBounds.width, y: svgBounds.height },
            viewportSize: {
                x: svgBounds.width / this.blockScripts.transformScale,
                y: svgBounds.height / this.blockScripts.transformScale
            },
            scroll: {
                x: -translation.x,
                y: -translation.y
            }
        });
    }

    private _updateGlobalTransformDOM() {
        this.svgScriptTranformScale.setScale(this.blockScripts.transformScale, this.blockScripts.transformScale);
        this.svgScriptTranformTranslate.setTranslate(this.blockScripts.transformPosition.x, this.blockScripts.transformPosition.y);
        this.svgBackgroundTranformScale.setScale(this.blockScripts.transformScale, this.blockScripts.transformScale);
        this.svgBackgroundTranformTranslate.setTranslate(this.blockScripts.transformPosition.x, this.blockScripts.transformPosition.y);
    }

    public addListeners() {
        window.addEventListener("mousedown", this.eventMouseDownListener, { passive: false });
        window.addEventListener("mouseup", this.eventMouseUpListener, { passive: false });
        window.addEventListener("mousemove", this.eventMouseMoveListener, { passive: false });
        window.addEventListener("wheel", this.eventWheelListener, { passive: false });
    }

    public removeListeners() {
        window.removeEventListener("mousedown", this.eventMouseDownListener);
        window.removeEventListener("mouseup", this.eventMouseUpListener);
        window.removeEventListener("mousemove", this.eventMouseMoveListener);
        window.removeEventListener("wheel", this.eventWheelListener);
    }

    public endInteraction() {
        if (!this._interaction) return;
        this._interaction.onEnd();
        this._interaction = null;
    }

    public startInteraction(interaction: ScuffrInteraction) {
        this.endInteraction();
        this._interaction = interaction;
    }

    private _dispatch<T>(element: any, listenerInvoker: (element: ScuffrElement) => boolean): boolean {
        if (!element) return false;

        let renderedElement: ScuffrElement | null;
        while (
            !(renderedElement = element[ScuffrElement.DATA_NAME]) &&
            element !== this.dom &&
            (element = element.parentElement)
        );

        if (!renderedElement) return false;

        do {
            if (listenerInvoker(renderedElement))
                return true;
        } while (renderedElement = renderedElement.parent);

        return false;
    }

    private readonly eventMouseDownListener = (event: MouseEvent) => {
        if (this._interaction) {
            this._interaction.onMouseDown(event);
        }
        if (!this._interaction) {
            event.preventDefault();
        }
        this._mouseDownPos = event;
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (this._interaction) {
            this._interaction.onMouseUp(event);
        }
        if (!this._interaction && this._mouseDownPos) {
            if (this._dispatch(event.target, (element) => element.onClick(event)))
                event.preventDefault();
        }
        this._mouseDownPos = null;
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
        if (this._interaction) {
            this._interaction.onMouseMove(event);
        }
        if (!this._interaction) {
            if ((event.buttons & 1) !== 0 && this._mouseDownPos) {
                // You can move the mouse a small amount before starting a drag
                //  just incase you intended a click not a drag.
                const dx = event.x - this._mouseDownPos.x;
                const dy = event.y - this._mouseDownPos.y;
                if (dx * dx + dy * dy > 16) {
                    if (this._dispatch(event.target, (element) => element.onDrag(event)))
                        event.preventDefault();
                    this._mouseDownPos = null;
                }
            }
            if (this._interaction) {
                (this._interaction as ScuffrInteraction).onMouseMove(event);
            }
        }
        // this.debugRender();
    }

    private readonly eventWheelListener = (event: WheelEvent) => {
        if (this._interaction) {
            this._interaction.onMouseWheel(event);
        }
        if (!this._interaction) {
            if (this._dispatch(event.target, (element) => element.onWheel(event)))
                event.preventDefault();
            else {
                let delta = -event.deltaY / this.blockScripts.transformScale;
                if (event.shiftKey) {
                    this.blockScripts.transformPosition.x += delta;
                } else {
                    this.blockScripts.transformPosition.y += delta;
                }
                this.updateGlobalTransform();
            }
        }
    }

    public getTextDimensions(text: string, node?: Text): Vec2 {
        return this._textSizeCache.getTextDimensions(text, node);
    }
}
