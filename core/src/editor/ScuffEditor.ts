import type { ScuffCore } from "../ScuffCore";
import type { ScuffEditorInteraction } from "./ScuffEditorInteraction";
import type { ScuffEditorPane, ScuffEditorPaneFactory } from "./panes/ScuffEditorPane";

export class ScuffEditor {
    public readonly scuff: ScuffCore;

    public readonly root: ScuffEditorPane;
    public readonly dom: HTMLDivElement;
    private readonly _resizeObserver: ResizeObserver;

    private _interaction: ScuffEditorInteraction | null;

    public constructor(scuff: ScuffCore, target: HTMLElement, root: ScuffEditorPaneFactory) {
        this.scuff = scuff;
        
        this.dom = target.appendChild(document.createElement("div"));
        this.dom.classList.add("scuff-editor");

        this.root = root({ editor: this, parent: null, target: this.dom.appendChild(document.createElement("div")) });
        this.root.target.classList.add("scuff-pane");

        this.root.setBounds(target.getBoundingClientRect());

        this._interaction = null;

        window.addEventListener("keydown", this.eventKeyDownListener, { passive: false, capture: true });
        window.addEventListener("mousedown", this.eventMouseDownListener, { passive: false, capture: true });
        window.addEventListener("mouseup", this.eventMouseUpListener, { passive: false, capture: true });
        window.addEventListener("mousemove", this.eventMouseMoveListener, { passive: false, capture: true });
        window.addEventListener("wheel", this.eventWheelListener, { passive: false, capture: true });
        window.addEventListener("contextmenu", this.eventContextMenuListener, { passive: false, capture: true });

        this._resizeObserver = new ResizeObserver(this.eventResizeObserver);
        this._resizeObserver.observe(this.dom);
    }

    public destroy() {
        this.endInteraction();

        window.removeEventListener("keydown", this.eventKeyDownListener);
        window.removeEventListener("mousedown", this.eventMouseDownListener);
        window.removeEventListener("mouseup", this.eventMouseUpListener);
        window.removeEventListener("mousemove", this.eventMouseMoveListener);
        window.removeEventListener("wheel", this.eventWheelListener);
        window.removeEventListener("contextmenu", this.eventContextMenuListener);

        this._resizeObserver.disconnect();

        this.root.onDestroy();
        this.dom.remove();
    }

    private readonly eventResizeObserver = (entries: ResizeObserverEntry[]) => {
        this.root.setBounds(this.root.target.getBoundingClientRect());
    }

    public startInteraction(interaction: ScuffEditorInteraction) {
        this.endInteraction();
        this._interaction = interaction;
        this._interaction.onStart();
    }

    public endInteraction() {
        if (this._interaction) {
            this._interaction.onEnd();
            this._interaction = null;
        }
    }

    private readonly eventKeyDownListener = (event: KeyboardEvent) => {
        if (this._interaction) this._interaction.onKeyDown(event);
    }

    private readonly eventMouseDownListener = (event: MouseEvent) => {
        if (this._interaction) this._interaction.onMouseDown(event);
    }

    private readonly eventMouseUpListener = (event: MouseEvent) => {
        if (this._interaction) this._interaction.onMouseUp(event);
    }

    private readonly eventMouseMoveListener = (event: MouseEvent) => {
        if (this._interaction) this._interaction.onMouseMove(event);
    }

    private readonly eventWheelListener = (event: WheelEvent) => {
        if (this._interaction) this._interaction.onMouseWheel(event);
    }

    private readonly eventContextMenuListener = (event: MouseEvent) => {
        if (this._interaction) this._interaction.onContextMenu(event);
    }
}