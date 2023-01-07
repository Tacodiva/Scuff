import type { Vec2 } from "../../utils/Vec2";
import type BlockInstance from "../BlockInstance";
import { BlockScript } from "../BlockScript";
import type BlockScripts from "../BlockScripts";
import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import type { ScuffrBlockInstanceElement } from "./SVGBlockRenderer";
import { renderScript, SVGRenderedScript, } from "./SVGScriptRenderer";

abstract class DragContext {
    public startPos: Vec2;

    public constructor(startPos: Vec2) {
        this.startPos = startPos;
    }

    public end() { }

    public abstract update(event: MouseEvent): void;
}

class PanningDragContext extends DragContext {
    public readonly workspace: SVGWorkspace;
    public readonly startTransform: Vec2;

    constructor(workspace: SVGWorkspace, startPos: Vec2) {
        super(startPos);
        this.workspace = workspace;
        this.startTransform = workspace.blockScripts.transformPosition;

    }

    public update(event: MouseEvent): void {
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

class ScriptDragContext extends DragContext {
    public readonly workspace: SVGWorkspace;
    public readonly script: SVGRenderedScript;
    public readonly offset: Vec2;

    constructor(workspace: SVGWorkspace, script: SVGRenderedScript, startPos: Vec2) {
        super(startPos);
        this.workspace = workspace;
        this.script = script;
        const startPosWorkspace = this.workspace.toWorkspaceCoords(startPos);
        this.offset = {
            x: script.script.translation.x - startPosWorkspace.x,
            y: script.script.translation.y - startPosWorkspace.y,
        };
    }

    public update(event: MouseEvent): void {
        const scriptCoords = this.workspace.toWorkspaceCoords(event);
        scriptCoords.x += this.offset.x;
        scriptCoords.y += this.offset.y;
        this.script.script.translation = scriptCoords;
        this.script.updateTransform();
    }
}

class SVGWorkspace extends ScuffrParentElement {

    public parent: null;
    
    public readonly blockScripts: BlockScripts;
    public children: SVGRenderedScript[];

    public readonly scriptContainer: SVGElement;
    public readonly backgroundPattern: SVGPatternElement;
    public readonly backgroundElement: SVGRectElement;

    private _dragCtx: DragContext | null;
    private _mouseDownPos: Vec2 | null;
    private _appliedScale: number;

    public constructor(root: SVGElement, backgroundPattern: SVGPatternElement, blockScripts: BlockScripts) {
        super(root, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.parent = null;

        this.blockScripts = blockScripts;
        this.children = [];

        this.backgroundPattern = backgroundPattern;
        this.backgroundElement = root.appendChild(document.createElementNS(SVG_NS, "rect"));
        this.scriptContainer = root.appendChild(document.createElementNS(SVG_NS, "g"));

        this.backgroundElement.setAttribute("width", "100%");
        this.backgroundElement.setAttribute("height", "100%");
        this.backgroundElement.setAttribute("style", `fill: url("#${backgroundPattern.id}");`);

        this._dragCtx = null;
        this._mouseDownPos = null;
        this._appliedScale = 1;

        this.updateGlobalTransform();

        for (const script of this.blockScripts.scripts) {
            this.children.push(renderScript(this, script));
        }
    }

    public addScript(script: BlockScript): SVGRenderedScript {
        const rendered = renderScript(this, script);
        this._addRenderedScript(rendered);
        return rendered;
    }

    private _addRenderedScript(script: SVGRenderedScript) {
        this.blockScripts.scripts.push(script.script);
        this.children.push(script);
    }

    public deleteScript(script: BlockScript): boolean {
        return this._deleteScriptAt(this.blockScripts.scripts.indexOf(script));
    }

    public deleteRenderedScript(script: SVGRenderedScript): boolean {
        return this._deleteScriptAt(this.children.indexOf(script));
    }

    public getRenderedScript(script: BlockScript): SVGRenderedScript {
        const rendered = this.children.find(rendered => rendered.script === script);
        if (!rendered) throw new Error("Script not a part of this workspace.");
        return rendered;
    }

    private _deleteScriptAt(idx: number): boolean {
        if (idx === -1) return false;
        this.blockScripts.scripts.splice(idx);
        this.children.splice(idx);
        return true;
    }

    public dragBlock(block: BlockInstance, mousePos: Vec2) {
        const script = new BlockScript([block]);
        const renderedScript = this.addScript(script);
        let pos = this.toWorkspaceCoords(mousePos);
        pos.x -= renderedScript.dimensions.x / 2;
        pos.y -= renderedScript.dimensions.y / 2;
        script.translation = pos;
        renderedScript.updateTransform();
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragRenderedBlock(block: ScuffrBlockInstanceElement, mousePos: Vec2) {
        const script = new BlockScript([block.block]);
        const renderedScript = new SVGRenderedScript(this, script);
        renderedScript.dimensions = block.dimensions;
        renderedScript.children.push(block);
        script.translation = block.getAbsoluteTranslation();
        renderedScript.updateTransform();
        // block.setParent(renderedScript, new BlockContainerRef(0, script));
        renderedScript.dom.appendChild(block.dom);
        block.translation = { x: 0, y: 0 };
        block.updateTraslation();
        this._addRenderedScript(renderedScript);
        this.dragRenderedScript(renderedScript, mousePos);
    }

    public dragScript(script: BlockScript, mousePos: Vec2) {
        this.dragRenderedScript(this.getRenderedScript(script), mousePos);
    }

    public dragRenderedScript(script: SVGRenderedScript, mousePos: Vec2) {
        this.drag(new ScriptDragContext(this, script, mousePos));
    }

    public toWorkspaceCoords(pos: Vec2): Vec2 {
        return {
            x: pos.x / this._appliedScale - this.blockScripts.transformPosition.x,
            y: pos.y / this._appliedScale - this.blockScripts.transformPosition.y
        };
    }

    protected override _getWorkspace(): SVGWorkspace {
        return this;
    }

    public override onDrag(startPosition: Vec2): boolean {
        this.drag(new PanningDragContext(this, startPosition));
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
        this.scriptContainer.setAttribute("transform", transform);
        this.backgroundPattern.setAttribute("patternTransform", transform);
        this._appliedScale = this.blockScripts.transformScale;
    }

    get scale() {
        return this._appliedScale;
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

    public dragEnd() {
        if (!this._dragCtx) return;
        this._dragCtx.end();
        this._dragCtx = null;
    }

    public drag(ctx: DragContext) {
        this.dragEnd();
        this._dragCtx = ctx;
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
        this._mouseDownPos = event;
        event.preventDefault();
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (this._dragCtx) {
            this.dragEnd();
        } else {
            if (this._dispatch(event.target, (element) => element.onClick(event)))
                event.preventDefault();
        }
        this._mouseDownPos = null;
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
        if (this._dragCtx) {
            this._dragCtx.update(event);
        } else if (this._mouseDownPos) {
            if (this._dispatch(event.target, (element) => element.onDrag(event)))
                event.preventDefault();
        }
    }

    private readonly eventWheelListener = (event: WheelEvent) => {
        this.dragEnd();
        if (this._dispatch(event.target, (element) => element.onWheel(event)))
            event.preventDefault();
    }
}

function renderWorkspace(root: SVGElement, backgroundPattern: SVGPatternElement, scripts: BlockScripts): SVGWorkspace {
    const element = new SVGWorkspace(root, backgroundPattern, scripts);

    if (true) {
        for (const script of element.children) {
            for (const connection of script.attachmentPoints) {
                const pos = connection.getAbsoluteTranslation();
                const point = element.scriptContainer.appendChild(document.createElementNS(SVG_NS, "circle"));
                point.setAttribute("r", "10");
                point.setAttribute("style", "fill: red;");
                point.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
            }
        }
    }

    return element;
}

export { renderWorkspace, SVGWorkspace as SVGRenderedWorkspace, DragContext }