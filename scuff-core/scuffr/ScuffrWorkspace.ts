import { BlockScriptRoot } from "../block/BlockScriptRoot";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import { ScuffrElement } from "./ScuffrElement";
import { ScuffrElementParent } from "./ScuffrElementParent";
import type { BlockScripts } from "../block/BlockScripts";
import type { BlockInstance } from "../block/BlockInstance";
import type { ScuffrElementInputLiteral } from "./ScuffrElementInputLiteral";
import { ScuffrAttachmentPointScript } from "./attachment-points/ScuffrAttachmentPointScript";
import type { ScuffrAttachmentPoint } from "./attachment-points/ScuffrAttachmentPoint";
import { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrAttachmentPointScriptTop } from "./attachment-points/ScuffrAttachmentPointScriptTop";

abstract class ScuffrAction {
    public readonly workspace: ScuffrWorkspace;

    public constructor(workspace: ScuffrWorkspace) {
        this.workspace = workspace;
    }

    protected end() {
        this.workspace.endAction();
    }

    public onEnd() { }

    public onMouseDown(event: MouseEvent): void {
        event.preventDefault();
    }

    public onMouseUp(event: MouseEvent): void {
        this.end();
    }

    public onMouseWheel(event: MouseEvent): void {
        this.end();
    }

    public onMouseMove(event: MouseEvent): void {
        if ((event.buttons & 1) !== 0)
            this.end();
    }
}

class PanningAction extends ScuffrAction {
    public readonly startTransform: Vec2;
    public readonly startPos: Vec2;

    constructor(workspace: ScuffrWorkspace, startPos: Vec2) {
        super(workspace);
        this.startPos = startPos;
        this.startTransform = workspace.blockScripts.transformPosition;
    }

    public override onMouseMove(event: MouseEvent): void {
        this.workspace.blockScripts.transformPosition = {
            x:
                this.startTransform.x +
                (event.x - this.startPos.x) / this.workspace.blockScripts.transformScale,
            y:
                this.startTransform.y +
                (event.y - this.startPos.y) / this.workspace.blockScripts.transformScale,
        };
        this.workspace.updateGlobalTransform();
    }
}

class ScriptDragAction extends ScuffrAction {
    public static readonly ATTACH_RADIUS = 60;

    public readonly script: ScuffrElementScriptRoot;
    public readonly offset: Vec2;
    public readonly startPos: Vec2;

    private _attachmentPoint: ScuffrAttachmentPoint | null;

    public constructor(workspace: ScuffrWorkspace, script: ScuffrElementScriptRoot, startPos: Vec2) {
        super(workspace);
        this.startPos = startPos;
        this.script = script;
        const startPosWorkspace = this.workspace.toWorkspaceCoords(startPos);
        this.offset = {
            x: script.translationX - startPosWorkspace.x,
            y: script.translationY - startPosWorkspace.y,
        };
        this._attachmentPoint = null;
        this.script.dom.classList.add("scuff-block-dragging");
    }

    public override onMouseMove(event: MouseEvent): void {
        const scriptCoords = this.workspace.toWorkspaceCoords(event);
        scriptCoords.x += this.offset.x;
        scriptCoords.y += this.offset.y;

        this.script.translationSelf = scriptCoords;
        this.script.updateTraslation();

        let newPoint = this._findAttachmentPoint();

        if (this._attachmentPoint !== newPoint) {
            if (this._attachmentPoint)
                this._attachmentPoint.unhighlight(this.script);
            this._attachmentPoint = newPoint;
            if (this._attachmentPoint)
                this._attachmentPoint.highlight(this.script);
        }
    }

    public override onEnd(): void {
        this.script.dom.classList.remove("scuff-block-dragging");
        if (this._attachmentPoint) {
            this._attachmentPoint.unhighlight(this.script);
            this._attachmentPoint.takeScript(this.script);
        }
    }

    private _findAttachmentPoint(): ScuffrAttachmentPoint | null {
        let closestDist = ScriptDragAction.ATTACH_RADIUS * ScriptDragAction.ATTACH_RADIUS;
        let closest = null;
        for (const pointList of this.workspace.attachmentPoints) {
            if (pointList.root === this.script) continue;
            for (const targetPoint of pointList.list) {
                const delta = targetPoint.calculateDelta(this.script);
                const dist = delta.x * delta.x + delta.y * delta.y;
                if (dist <= closestDist
                    && targetPoint.canTakeScript(this.script)) {
                    closestDist = dist;
                    closest = targetPoint;
                }
            }
        }
        return closest;
    }
}

class LiteralInputEditAction extends ScuffrAction {
    public readonly scuffrInput: ScuffrElementInputLiteral;
    public readonly svgForeignObject: SVGForeignObjectElement;
    public readonly htmlInput: HTMLInputElement;

    public constructor(workspace: ScuffrWorkspace, input: ScuffrElementInputLiteral) {
        super(workspace);
        this.scuffrInput = input;

        this.scuffrInput.content.dom.style.display = "none";

        this.svgForeignObject = this.scuffrInput.dom.appendChild(document.createElementNS(SVG_NS, "foreignObject"));
        this.svgForeignObject.setAttribute("height", "1.2em");
        if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
            // If on firefox...
            this.svgForeignObject.setAttribute("y", "-0.6em");
        } else {
            // Otherwise...
            this.svgForeignObject.setAttribute("y", "-0.7em");
        }
        this.svgForeignObject.setAttribute("x", "-0.1em");
        this._updateDOM();

        this.htmlInput = this.svgForeignObject.appendChild(document.createElement("input"));
        this.htmlInput.classList.add("scuff-input", "scuffr-block-text");
        this.htmlInput.value = this.scuffrInput.content.text;
        this.htmlInput.oninput = this._onInputChange;
        this.htmlInput.focus();
        this.htmlInput.select();

        this.scuffrInput.shapeDOM.classList.add("scuff-input-highlighted");
    }

    private _updateDOM() {
        this.svgForeignObject.setAttribute("transform", `translate(${this.scuffrInput.content.translationX}, ${this.scuffrInput.content.translationY})`);
        this.svgForeignObject.setAttribute("width", (this.scuffrInput.content.dimensions.x + 5) + "px");
    }

    private _onInputChange = () => {
        this.scuffrInput.setValue(this.htmlInput.value);
        this._updateDOM();
    }

    public override onEnd(): void {
        this.svgForeignObject.remove();
        this.scuffrInput.content.dom.style.display = "";
        this.scuffrInput.shapeDOM.classList.remove("scuff-input-highlighted");
    }

    public override onMouseMove(event: MouseEvent): void {
        if (event.target !== this.htmlInput)
            super.onMouseMove(event);
    }

    public override onMouseDown(event: MouseEvent): void {
        if (event.target !== this.htmlInput)
            super.onMouseDown(event);
    }

    public override onMouseUp(event: MouseEvent): void {
        if (event.target !== this.htmlInput)
            super.onMouseUp(event);
    }
}

export class ScuffrWorkspace extends ScuffrElementParent {
    public parent: null;

    public readonly blockScripts: BlockScripts;
    public children: ScuffrElementScriptRoot[];

    public readonly svgScriptContainer: SVGElement;
    public readonly svgTextStagingElement: SVGElement;
    public readonly svgBackgroundPattern: SVGPatternElement;
    public readonly svgBackgroundElement: SVGRectElement;
    public readonly svgDebug: SVGElement;

    public readonly attachmentPoints: Set<ScuffrAttachmentPointList>;

    private _action: ScuffrAction | null;
    private _mouseDownPos: Vec2 | null;

    public constructor(root: SVGElement, backgroundPattern: SVGPatternElement, blockScripts: BlockScripts) {
        super(root);
        (<any>window).workspace = this;
        this.parent = null;

        this.blockScripts = blockScripts;
        this.children = [];
        this.attachmentPoints = new Set();

        this.svgBackgroundPattern = backgroundPattern;
        this.svgBackgroundElement = root.appendChild(document.createElementNS(SVG_NS, "rect"));
        this.svgBackgroundElement.setAttribute("width", "100%");
        this.svgBackgroundElement.setAttribute("height", "100%");
        this.svgBackgroundElement.style.fill = `url("#${backgroundPattern.id}")`;

        this.svgScriptContainer = root.appendChild(document.createElementNS(SVG_NS, "g"));
        this.svgDebug = this.svgScriptContainer.appendChild(document.createElementNS(SVG_NS, "g"));

        this.svgTextStagingElement = root.appendChild(document.createElementNS(SVG_NS, "g")).appendChild(document.createElementNS(SVG_NS, "text"));
        this.svgTextStagingElement.classList.add("scuffr-block-text");

        this._action = null;
        this._mouseDownPos = null;

        this.updateGlobalTransform();

        for (const script of this.blockScripts.scripts) {
            const rendered = new ScuffrElementScriptRoot(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }
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
        renderedScript.updateTraslation();
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragRenderedBlock(block: ScuffrElementBlockInstance, mousePos: Vec2) {
        const renderedScript = new ScuffrElementScriptRoot(this, null, [block]);
        this.addRenderedScript(renderedScript);
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragScript(script: BlockScriptRoot, mousePos: Vec2) {
        this.dragRenderedScript(this.getRenderedScript(script), mousePos);
    }

    public dragRenderedScript(script: ScuffrElementScriptRoot, mousePos: Vec2) {
        this.startAction(new ScriptDragAction(this, script, mousePos));
        // Move the script to the bottom of the container so it renders on top of everything else
        this.svgScriptContainer.appendChild(script.dom);
    }

    public editLiteralInput(input: ScuffrElementInputLiteral) {
        this.startAction(new LiteralInputEditAction(this, input));
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
        this.startAction(new PanningAction(this, startPosition));
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

    public updateGlobalTransform() {
        const transform = `scale(${this.blockScripts.transformScale}) translate(${this.blockScripts.transformPosition.x}, ${this.blockScripts.transformPosition.y})`;
        this.svgScriptContainer.setAttribute("transform", transform);
        this.svgBackgroundPattern.setAttribute("patternTransform", transform);
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

    public endAction() {
        if (!this._action) return;
        this._action.onEnd();
        this._action = null;
    }

    public startAction(action: ScuffrAction) {
        this.endAction();
        this._action = action;
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
        if (this._action) {
            this._action.onMouseDown(event);
        }
        if (!this._action) {
            event.preventDefault();
        }
        this._mouseDownPos = event;
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (this._action) {
            this._action.onMouseUp(event);
        }
        if (!this._action && this._mouseDownPos) {
            if (this._dispatch(event.target, (element) => element.onClick(event)))
                event.preventDefault();
        }
        this._mouseDownPos = null;
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
        if (this._action) {
            this._action.onMouseMove(event);
        }
        if (!this._action) {
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
            if (this._action) {
                (this._action as ScuffrAction).onMouseMove(event);
            }    
        }
        // this.debugRender();
    }

    private readonly eventWheelListener = (event: WheelEvent) => {
        if (this._action) {
            this._action.onMouseWheel(event);
        }
        if (!this._action) {
            if (this._dispatch(event.target, (element) => element.onWheel(event)))
                event.preventDefault();
        }
    }

    public getTextNodeDimensions(node: Text): Vec2 {
        this.svgTextStagingElement.appendChild(node);
        const bounds = this.svgTextStagingElement.getBoundingClientRect();
        return { x: bounds.width, y: bounds.height };
    }
}
