
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";
import { ScuffEditorInteractionDrag } from "../ScuffEditorInteractionDrag";
import { Axis, Bounds, type AxisInfo } from "@scuff/core";

const DIVIDER_HALF_SIZE = 1;
const DIVIDER_SIZE = DIVIDER_HALF_SIZE * 2;

export class ScuffEditorPaneSplit extends ScuffEditorPane {

    public static createHorizontal(left: ScuffEditorPaneFactory, right: ScuffEditorPaneFactory, position?: number): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, left, right, position, Axis.X);
    }

    public static createVertical(top: ScuffEditorPaneFactory, bottom: ScuffEditorPaneFactory, position?: number): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, top, bottom, position, Axis.Y);
    }

    private static DragInteraction = class extends ScuffEditorInteractionDrag {
        public readonly pane: ScuffEditorPaneSplit;
        public readonly offset: number;

        public constructor(pane: ScuffEditorPaneSplit, e: MouseEvent) {
            super(pane.editor);
            this.pane = pane;
            this.offset = this.pane._position * this.pane._bounds[this.pane.axis.dim] - e[this.pane.axis.name];
            e.preventDefault();
            e.stopPropagation();    
        }

        public override onStart(): void {
            this.pane.divider.classList.add("scuff-dragging");
            super.onStart();
        }

        public override onEnd(): void {
            this.pane.divider.classList.remove("scuff-dragging");
            super.onEnd();
        }

        public override onMouseMove(e: MouseEvent): void {
            this.pane._position = (this.offset + e[this.pane.axis.name]) / this.pane._bounds[this.pane.axis.dim];
            this.pane._position = Math.max(0, Math.min(1, this.pane._position));
            this.pane.onBoundsUpdate();
            super.onMouseMove(e);
        }
    };

    public readonly divider: HTMLDivElement;
    public readonly spacer: HTMLDivElement;
    public readonly axis: AxisInfo;

    private _one: ScuffEditorPane;
    private _two: ScuffEditorPane;
    private _position: number;

    private constructor(pane: ScuffEditorPaneInfo, one: ScuffEditorPaneFactory, two: ScuffEditorPaneFactory, position: number | undefined, axisInfo: AxisInfo) {
        super(pane);
        this.axis = axisInfo;

        this.target.classList.add("scuff-pane-split", "scuff-pane-split-" + axisInfo.dir);

        this._one = one({ editor: this.editor, parent: this, target: this.target.appendChild(document.createElement("div")) });
        this.spacer = this.target.appendChild(document.createElement("div"));
        this._two = two({ editor: this.editor, parent: this, target: this.target.appendChild(document.createElement("div")) });

        this.spacer.classList.add("scuff-pane-split-spacer-" + axisInfo.dir)

        this.divider = this.target.appendChild(document.createElement("div"));
        this.divider.classList.add("scuff-pane-split-divider", "scuff-pane-split-divider-" + axisInfo.dir);
        this.divider.addEventListener("mousedown", e =>
            this.editor.startInteraction(new ScuffEditorPaneSplit.DragInteraction(this, e))
        );

        this._one.target.classList.add("scuff-pane");
        this._two.target.classList.add("scuff-pane");

        const cross = Axis.getCross(this.axis);
        this._minSize = Axis.vector(this.axis,
            Math.max(this._one.minSize[cross], this._two.minSize[cross]),
            this._one.minSize[this.axis.name] + this._two.minSize[this.axis.name] + DIVIDER_SIZE
        );

        this._position = position ?? 0.5;
    }

    public override onBoundsUpdate(): void {
        const axisSize = this._bounds[this.axis.dim];
        let pixelPosition = this._position * axisSize;

        if (axisSize <= this._one.minSize[this.axis.name] + this._two.minSize[this.axis.name]) {
            this._position = 0.5;
        } else if (pixelPosition < this._one.minSize[this.axis.name]) {
            this._position = Math.min(1, this._one.minSize[this.axis.name] / axisSize);
            pixelPosition = this._position * axisSize;
        } else if ((1 - this._position) * axisSize < this._two.minSize[this.axis.name]) {
            this._position = 1 - Math.min(1, this._two.minSize[this.axis.name] / axisSize);
            pixelPosition = this._position * axisSize;
        }

        this.divider.style[this.axis.side_neg] = pixelPosition + "px";

        const cross = Axis.getCrossInfo(this.axis);
        const crossSize = this._bounds[cross.dim];

        const aSize = pixelPosition - DIVIDER_HALF_SIZE;
        this._one.target.style[this.axis.dim] = aSize + "px";
        this._one.setBounds(Bounds.from(
            { x: this._bounds.x, y: this.bounds.y },
            Axis.vector(this.axis, aSize, crossSize)
        ));

        const bSize = this._bounds[this.axis.dim] - (aSize + DIVIDER_SIZE);
        this._two.target.style[this.axis.dim] = bSize + "px";
        this._two.setBounds(Bounds.from(
            Axis.vector(this.axis, this._bounds[this.axis.name] + pixelPosition + DIVIDER_HALF_SIZE, this._bounds[cross.name]),
            Axis.vector(this.axis, bSize, crossSize)
        ));
    }
}