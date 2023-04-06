
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";
import { Axis, type AxisInfo } from '../utils/Axis';
import { Bounds } from "../utils/Bounds";
import type { Vec2 } from "../utils/Vec2";

const DIVIDER_HALF_SIZE = 1;
const DIVIDER_SIZE = DIVIDER_HALF_SIZE * 2;

export class ScuffEditorPaneSplit extends ScuffEditorPane {

    public static createHorizontal(left: ScuffEditorPaneFactory, right: ScuffEditorPaneFactory, position?: number): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, left, right, position, Axis.X);
    }

    public static createVertical(top: ScuffEditorPaneFactory, bottom: ScuffEditorPaneFactory, position?: number): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, top, bottom, position, Axis.Y);
    }

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
        this.divider.addEventListener("mousedown", e => {
            const offset = this._position * this._bounds[this.axis.dim] - e[axisInfo.name];
            this.editor.startDrag({
                onMouseMove: e => {
                    this._position = (offset + e[axisInfo.name]) / this._bounds[this.axis.dim];
                    this._position = Math.max(0, Math.min(1, this._position));
                    this.divider.classList.add("scuff-dragging");
                    this.onBoundsUpdate();
                },
                onEnd: () => {
                    this.divider.classList.remove("scuff-dragging");
                }
            }, e);
        });

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