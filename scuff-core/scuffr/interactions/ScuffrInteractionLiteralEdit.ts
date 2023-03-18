import type { ScuffrSvgInputLiteral } from "..";
import { ScuffrCmdSetInputLiteral } from "../commands/ScuffrCmdSetInputLiteral";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";

export class ScuffrInteractionLiteralEdit extends ScuffrInteraction {
    public readonly scuffrInput: ScuffrSvgInputLiteral;
    public readonly svgForeignObject: SVGForeignObjectElement;
    public readonly htmlInput: HTMLInputElement;

    public readonly initalValue: string;
    public inputValid: boolean;

    public constructor(input: ScuffrSvgInputLiteral) {
        super(input.workspace);
        this.scuffrInput = input;
        this.initalValue = input.getValue();
        this.inputValid = true;

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

        this.scuffrInput.shapeDOM.classList.add("scuff-input-selected");
        this._updateDOM();

        this.htmlInput = this.svgForeignObject.appendChild(document.createElement("input"));
        this.htmlInput.classList.add("scuff-input", "scuff-block-text");
        this.htmlInput.value = this.scuffrInput.content.text;
        this.htmlInput.oninput = this._onInputChange;
        this.htmlInput.focus();
        this.htmlInput.select();
    }

    private _updateDOM() {
        this.svgForeignObject.setAttribute("transform", `translate(${this.scuffrInput.content.translationX}, ${this.scuffrInput.content.translationY})`);
        this.svgForeignObject.setAttribute("width", (this.scuffrInput.content.dimensions.x + 5) + "px");
        let isValueValid = this.scuffrInput.isValueValid();
        if (this.inputValid && !isValueValid) {
            this.scuffrInput.shapeDOM.classList.remove("scuff-input-selected");
            this.scuffrInput.shapeDOM.classList.add("scuff-input-invalid");
            this.inputValid = false;
        } else if (!this.inputValid && isValueValid) {
            this.scuffrInput.shapeDOM.classList.add("scuff-input-selected");
            this.scuffrInput.shapeDOM.classList.remove("scuff-input-invalid");
            this.inputValid = true;
        }
    }

    private _onInputChange = () => {
        this.scuffrInput.setValue(this.htmlInput.value);
        this._updateDOM();
    };

    public override onEnd(): void {
        if (!this.inputValid) {
            this.scuffrInput.setValue(this.initalValue);
        } else if (this.scuffrInput.getValue() !== this.initalValue) {
            this.workspace.submitCommand(
                new ScuffrCmdSetInputLiteral(this.scuffrInput, this.scuffrInput.getValue(), this.initalValue),
                false
            );
        }
        this.svgForeignObject.remove();
        this.scuffrInput.content.dom.style.display = "";
        this.scuffrInput.shapeDOM.classList.remove("scuff-input-selected");
        this.scuffrInput.shapeDOM.classList.remove("scuff-input-invalid");
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
