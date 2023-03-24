import type { Vec2 } from "../utils/Vec2";
import { ScuffrTextSizeCache } from "./ScuffrTextSizeCache";
import type { ScuffrInteraction } from "./interactions/ScuffrInteraction";
import type { ScuffrCmd } from "./commands/ScuffrCmd";
import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";

export abstract class ScuffrWorkspace extends ScuffrElement<SVGSVGElement> implements ScuffrElementParent {
    public parent: null;
    public abstract readonly children: readonly ScuffrElement[];

    private readonly _textSizeCache: ScuffrTextSizeCache;

    private _interaction: ScuffrInteraction | null;
    private _mouseDownPos: Vec2 | null;

    private readonly _commandHistory: ScuffrCmd[];
    private _commandHistoryPresent: number;

    public constructor(target: SVGSVGElement) {
        super(target);
        this.parent = null;
        
        this._interaction = null;
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

    public onKeyDown(event: KeyboardEvent): boolean {
        switch (event.key) {
            case 'z':
                if (event.ctrlKey) {
                    this.undo();
                    return true;
                }
                break;
            case 'y':
                if (event.ctrlKey) {
                    this.redo();
                    return true;
                }
                break;
        }
        return false;
    }

    public addListeners() {
        window.addEventListener("keydown", this.eventKeyDownListener, { passive: false });
        this.dom.addEventListener("mousedown", this.eventMouseDownListener, { passive: false });
        window.addEventListener("mouseup", this.eventMouseUpListener, { passive: false });
        window.addEventListener("mousemove", this.eventMouseMoveListener, { passive: false });
        this.dom.addEventListener("wheel", this.eventWheelListener, { passive: false });
        window.addEventListener("contextmenu", this.eventContextMenuListener, { passive: false });
    }

    public removeListeners() {
        window.removeEventListener("keydown", this.eventKeyDownListener);
        this.dom.removeEventListener("mousedown", this.eventMouseDownListener);
        window.removeEventListener("mouseup", this.eventMouseUpListener);
        window.removeEventListener("mousemove", this.eventMouseMoveListener);
        this.dom.removeEventListener("wheel", this.eventWheelListener);
        window.removeEventListener("contextmenu", this.eventContextMenuListener);
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

    private readonly eventKeyDownListener = (event: KeyboardEvent) => {
        if (this._interaction) {
            this._interaction.onKeyDown(event);
        }
        if (!this._interaction) {
            this.onKeyDown(event);
        }
    }

    private readonly eventMouseDownListener = (event: MouseEvent) => {
        if ((event.buttons & 1) === 0)
            return;
        this._mouseDownPos = event;
        if (this._interaction) {
            if (this._interaction.onMouseDown(event))
                return;
        }
        if (!this._interaction) {
            event.preventDefault();
        }
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (event.button !== 0)
            return;
        if (this._interaction) {
            if (this._interaction.onMouseUp(event))
                return;
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
        }
    }

    private readonly eventContextMenuListener = (event: MouseEvent) => {
        if (this._dispatch(event.target, (element) => element.onRightClick(event)))
            event.preventDefault();
    }

    public getTextDimensions(text: string, node?: Text): Vec2 {
        return this._textSizeCache.getTextDimensions(text, node);
    }
}
