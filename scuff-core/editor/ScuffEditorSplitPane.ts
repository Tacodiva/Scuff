
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";
import { Axis, type AxisInfo } from '../utils/Axis';

const DIVIDER_HALF_SIZE = 1;
const DIVIDER_SIZE = DIVIDER_HALF_SIZE * 2;



export class ScuffEditorPaneSplit extends ScuffEditorPane {

    public static createHorizontal(left: ScuffEditorPaneFactory, right: ScuffEditorPaneFactory): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, left, right, Axis.X);
    }

    public static createVertical(top: ScuffEditorPaneFactory, bottom: ScuffEditorPaneFactory): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSplit(pane, top, bottom, Axis.Y);
    }

    public readonly divider: HTMLDivElement;
    public readonly spacer: HTMLDivElement;
    public readonly axis: AxisInfo;

    private _one: ScuffEditorPane;
    private _two: ScuffEditorPane;
    private _position: number;

    private constructor(pane: ScuffEditorPaneInfo, one: ScuffEditorPaneFactory, two: ScuffEditorPaneFactory, axisInfo: AxisInfo) {
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
            const offset = this._position * this._dimensions[this.axis.name] - e[axisInfo.name];
            this.editor.startDrag({
                onMouseMove: e => {
                    this._position = (offset + e[axisInfo.name]) / this._dimensions[this.axis.name];
                    this._position = Math.max(0, Math.min(1, this._position));
                    this.divider.classList.add("scuff-dragging");
                    this.onDimensionUpdate();
                },
                onEnd: () => {
                    this.divider.classList.remove("scuff-dragging");
                }
            }, e);
        });

        this._one.target.classList.add("scuff-pane");
        this._two.target.classList.add("scuff-pane");

        this._position = 0.5;
    }

    public override onDimensionUpdate(): void {
        const pixelPosition = this._position * this._dimensions[this.axis.name];
        const cross = Axis.getCross(this.axis);

        const aSize = pixelPosition - DIVIDER_HALF_SIZE;

        this._one.target.style[this.axis.dim] = aSize + "px";
        this._one.setDimensions(Axis.vector(this.axis, aSize, this._dimensions[cross]));

        const bSize = this._dimensions[this.axis.name] - (aSize + DIVIDER_SIZE);
        this._two.target.style[this.axis.dim] = bSize + "px";
        this.divider.style[this.axis.side_neg] = pixelPosition + "px";

        this._two.setDimensions(Axis.vector(this.axis, bSize, this._dimensions[cross]));
    }

}