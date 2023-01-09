import { BlockScript } from "../block/BlockScript";
import type { Vec2 } from "../utils/Vec2";
import { ScuffrScriptAttachmentPoint, type ScuffrAttachmentPoint, type ScuffrAttachmentPointList } from "./ScuffrAttachmentPoint";
import type { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";
import type { BlockScripts } from "../block/BlockScripts";
import type { BlockInstance } from "../block/BlockInstance";
import type { ScuffrLiteralInputElement } from "./ScuffrLiteralInputElement";
import { BlockInputString } from "../block/BlockInputType";

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
    public static readonly ATTACH_RADIUS = 40;

    public readonly script: ScuffrRootScriptElement;
    public readonly offset: Vec2;
    public readonly startPos: Vec2;

    private _attachmentPoint: ScuffrAttachmentPoint | null;

    public constructor(workspace: ScuffrWorkspace, script: ScuffrRootScriptElement, startPos: Vec2) {
        super(workspace);
        this.startPos = startPos;
        this.script = script;
        const startPosWorkspace = this.workspace.toWorkspaceCoords(startPos);
        this.offset = {
            x: script.script.translation.x - startPosWorkspace.x,
            y: script.script.translation.y - startPosWorkspace.y,
        };
        this._attachmentPoint = null;
    }

    public override onMouseMove(event: MouseEvent): void {
        const scriptCoords = this.workspace.toWorkspaceCoords(event);
        scriptCoords.x += this.offset.x;
        scriptCoords.y += this.offset.y;

        this.script.script.translation = scriptCoords;
        this.script.updateTraslation();

        this._attachmentPoint = this._findAttachmentPoint();
    }

    public override onEnd(): void {
        if (this._attachmentPoint) {
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
    public readonly scuffrInput: ScuffrLiteralInputElement;
    public readonly svgForeignObject: SVGForeignObjectElement;
    public readonly htmlInput: HTMLInputElement;

    public constructor(workspace: ScuffrWorkspace, input: ScuffrLiteralInputElement) {
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
        this.htmlInput.classList.add("scuff-block-input", "scuff-block-text");
        this.htmlInput.value = this.scuffrInput.content.text;
        this.htmlInput.oninput = this._onInputChange;
        if (this.scuffrInput.content.fill)
            this.htmlInput.style.color = this.scuffrInput.content.fill;
        this.htmlInput.focus();
        this.htmlInput.select();
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

export class ScuffrWorkspace extends ScuffrParentElement {
    public parent: null;

    public readonly blockScripts: BlockScripts;
    public children: ScuffrRootScriptElement[];

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
        this.svgTextStagingElement.classList.add("scuff-block-text");

        this._action = null;
        this._mouseDownPos = null;

        this.updateGlobalTransform();

        for (const script of this.blockScripts.scripts) {
            const rendered = new ScuffrRootScriptElement(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }
    }

    public debugRenderPoints() {
        this.svgDebug.innerHTML = "";
        this.svgScriptContainer.appendChild(this.svgDebug);
        for (const list of this.attachmentPoints) {
            for (const point of list.list) {
                const pointElement = this.svgDebug.appendChild(document.createElementNS(SVG_NS, "circle"));
                pointElement.setAttribute("r", "10");
                if (point instanceof ScuffrScriptAttachmentPoint)
                    pointElement.setAttribute("style", "fill: #ff0000a0;");
                else
                    pointElement.setAttribute("style", "fill: #00ff00a0;");
                const pointPos = point.translation;
                pointElement.setAttribute("transform", `translate(${point.root.translationX + pointPos.x}, ${point.root.translationY + pointPos.y})`);
            }
        }
    }

    public debugUpdatePoints() {
        for (const list of this.attachmentPoints) list.onAncestryChange(list.root);
        this.debugRenderPoints();
    }

    public debugRerenderScripts() {
        for (const script of this.children)
            script.dom.remove();
        this.children.length = 0;
        this.attachmentPoints.clear();
        for (const script of this.blockScripts.scripts) {
            const rendered = new ScuffrRootScriptElement(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }
    }

    public addScript(script: BlockScript): ScuffrRootScriptElement {
        const rendered = new ScuffrRootScriptElement(this, script);
        rendered.updateAll();
        this._addRenderedScript(rendered);
        return rendered;
    }

    private _addRenderedScript(script: ScuffrRootScriptElement) {
        this.blockScripts.scripts.push(script.script);
        this.children.push(script);
    }

    public deleteScript(script: BlockScript, deleteBlocks?: boolean): boolean {
        return this._deleteScriptAt(this.blockScripts.scripts.indexOf(script), deleteBlocks);
    }

    public deleteRenderedScript(script: ScuffrRootScriptElement, deleteBlocks?: boolean): boolean {
        return this._deleteScriptAt(this.children.indexOf(script), deleteBlocks);
    }

    public getRenderedScript(script: BlockScript): ScuffrRootScriptElement {
        const rendered = this.children.find(rendered => rendered.script === script);
        if (!rendered) throw new Error("Script not a part of this workspace.");
        return rendered;
    }

    private _deleteScriptAt(idx: number, deleteBlocks: boolean = true): boolean {
        if (idx === -1) return false;
        this.blockScripts.scripts.splice(idx, 1);
        if (deleteBlocks) this.children.splice(idx, 1)[0].remove();
        else this.children.splice(idx, 1);
        return true;
    }

    public dragBlock(block: BlockInstance, mousePos: Vec2) {
        const script = new BlockScript([block]);
        const renderedScript = this.addScript(script);
        let pos = this.toWorkspaceCoords(mousePos);
        pos.x -= renderedScript.dimensions.x / 2;
        pos.y -= renderedScript.dimensions.y / 2;
        script.translation = pos;
        renderedScript.updateTraslation();
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragRenderedBlock(block: ScuffrBlockInstanceElement, mousePos: Vec2) {
        const renderedScript = new ScuffrRootScriptElement(this, block);
        this._addRenderedScript(renderedScript);
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragScript(script: BlockScript, mousePos: Vec2) {
        this.dragRenderedScript(this.getRenderedScript(script), mousePos);
    }

    public dragRenderedScript(script: ScuffrRootScriptElement, mousePos: Vec2) {
        this.startAction(new ScriptDragAction(this, script, mousePos));
        // Move the script to the bottom of the container so it renders on top of everything else
        this.svgScriptContainer.appendChild(script.dom);
    }

    public editLiteralInput(input: ScuffrLiteralInputElement) {
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
        }
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
