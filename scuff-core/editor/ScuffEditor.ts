import type { ScuffEditorDragContext } from "./ScuffEditorDragContext";
import type { ScuffEditorPane, ScuffEditorPaneFactory } from "./ScuffEditorPane";

export class ScuffEditor {

    public readonly root: ScuffEditorPane;
    public readonly dom: HTMLDivElement;
    private readonly _resizeObserver: ResizeObserver;

    private _drag: ScuffEditorDragContext | null;

    public constructor(target: HTMLElement, root: ScuffEditorPaneFactory) {
        this.dom = target.appendChild(document.createElement("div"));
        this.dom.classList.add("scuff-editor");

        this.root = root({ editor: this, parent: null, target: this.dom.appendChild(document.createElement("div")) });
        this.root.target.classList.add("scuff-pane");

        this.root.setBounds(target.getBoundingClientRect());

        this._drag = null;

        window.addEventListener("mouseup", this.eventMouseUpListener, { passive: false });
        window.addEventListener("mousemove", this.eventMouseMoveListener, { passive: false });

        this._resizeObserver = new ResizeObserver(this.eventResizeObserver);
        this._resizeObserver.observe(this.dom);
    }

    public destroy() {
        this.endDrag();

        window.removeEventListener("mouseup", this.eventMouseUpListener);
        window.removeEventListener("mousemove", this.eventMouseMoveListener);

        this._resizeObserver.disconnect();

        this.root.onDestroy();
        this.dom.remove();
    }

    private readonly eventResizeObserver = (entries: ResizeObserverEntry[]) => {
        this.root.setBounds(this.root.target.getBoundingClientRect());
    }

    public startDrag(drag: ScuffEditorDragContext, e: MouseEvent) {
        this.endDrag();
        this._drag = drag;
        this._drag.onMouseMove(e);
        e.preventDefault();
        e.stopPropagation();
    }

    public endDrag(): boolean {
        if (this._drag) {
            this._drag.onEnd();
            this._drag = null;
            return true;
        }
        return false;
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (this.endDrag())
            event.preventDefault();
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
        if (this._drag) {
            this._drag.onMouseMove(event);
            event.preventDefault();
            event.stopPropagation();
        }
    }
}