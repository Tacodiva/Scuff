import type { Vec2 } from "@scuff/core";
import { ScuffrTextSizeCache } from "./ScuffrTextSizeCache";
import type { ScuffrCmd } from "./commands/ScuffrCmd";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffEditor } from "../editor";

export abstract class ScuffrWorkspace extends ScuffrElement<SVGSVGElement> implements ScuffrElementParent {
    public parent: null;
    public readonly editor: ScuffEditor;
    public abstract readonly children: readonly ScuffrElement[];

    private readonly _textSizeCache: ScuffrTextSizeCache;

    private _mouseDownPos: Vec2 | null;

    private readonly _commandHistory: ScuffrCmd[];
    private _commandHistoryPresent: number;

    public constructor(target: SVGSVGElement, editor: ScuffEditor) {
        super(target);
        this.editor = editor;
        this.parent = null;

        this._mouseDownPos = null;

        this._commandHistory = [];
        this._commandHistoryPresent = 0;

        this._textSizeCache = new ScuffrTextSizeCache(this);

        (<any>window).workspace = this;
    }

    public submitCommand(command: ScuffrCmd, execute: boolean = true) {
        if (execute) command.do();
        if (this._commandHistoryPresent === this._commandHistory.length) {
            this._commandHistory.push(command);
            ++this._commandHistoryPresent;
        } else {
            this._commandHistory.splice(this._commandHistoryPresent);
            this._commandHistory.push(command);
            this._commandHistoryPresent = this._commandHistory.length;
        }
    }

    public peekUndo(): ScuffrCmd | undefined {
        return this._commandHistory[this._commandHistoryPresent - 1];
    }

    public peekRedo(): ScuffrCmd | undefined {
        return this._commandHistory[this._commandHistoryPresent];
    }

    public undo(): boolean {
        if (this._commandHistoryPresent === 0)
            return false;
        --this._commandHistoryPresent;
        this._commandHistory[this._commandHistoryPresent].undo();
        return true;
    }

    public redo(): boolean {
        if (this._commandHistoryPresent === this._commandHistory.length)
            return false;
        this._commandHistory[this._commandHistoryPresent].do();
        ++this._commandHistoryPresent;
        return true;
    }

    protected override _getWorkspace(): ScuffrWorkspace {
        return this;
    }

    public addListeners() {
        this.dom.addEventListener("keydown", this.eventKeyDownListener, { passive: false });
        this.dom.addEventListener("mousedown", this.eventMouseDownListener, { passive: false });
        this.dom.addEventListener("mouseup", this.eventMouseUpListener, { passive: false });
        this.dom.addEventListener("mousemove", this.eventMouseMoveListener, { passive: false });
        this.dom.addEventListener("wheel", this.eventWheelListener, { passive: false });
        this.dom.addEventListener("contextmenu", this.eventContextMenuListener, { passive: false });
    }

    public removeListeners() {
        this.dom.removeEventListener("keydown", this.eventKeyDownListener);
        this.dom.removeEventListener("mousedown", this.eventMouseDownListener);
        this.dom.removeEventListener("mouseup", this.eventMouseUpListener);
        this.dom.removeEventListener("mousemove", this.eventMouseMoveListener);
        this.dom.removeEventListener("wheel", this.eventWheelListener);
        this.dom.removeEventListener("contextmenu", this.eventContextMenuListener);
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

    private readonly eventKeyDownListener = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'z':
                if (event.ctrlKey) {
                    this.undo();
                }
                break;
            case 'y':
                if (event.ctrlKey) {
                    this.redo();
                }
                break;
        }
    }

    private readonly eventMouseDownListener = (event: MouseEvent) => {
        if ((event.buttons & 1) === 0)
            return;
        this._mouseDownPos = event;
        event.preventDefault();
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (event.button !== 0)
            return;
        if (this._dispatch(event.target, (element) => element.onClick(event)))
            event.preventDefault();
        this._mouseDownPos = null;
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
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

    private readonly eventWheelListener = (event: WheelEvent) => {
        if (this._dispatch(event.target, (element) => element.onWheel(event)))
            event.preventDefault();
    }

    private readonly eventContextMenuListener = (event: MouseEvent) => {
        if (this._dispatch(event.target, (element) => element.onRightClick(event)))
            event.preventDefault();
    }

    public getTextDimensions(text: string, node?: Text): Vec2 {
        return this._textSizeCache.getTextDimensions(text, node);
    }
}
