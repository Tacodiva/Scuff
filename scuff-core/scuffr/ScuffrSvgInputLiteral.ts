import type { BlockInput } from "../block/BlockInput";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import { ScuffrSvgInputBase } from "./ScuffrSvgBlockInputBase";
import { ScuffrSvgText } from "./ScuffrSvgText";
import type { BlockInputLiteral } from "../block/BlockInputLiteral";
import { ScuffrShapeInputRound } from "./shape/ScuffrShapeInputRound";
import type { ScuffrShape } from "./shape";
import { ScuffrInteractionLiteralEdit } from "./interactions/ScuffrInteractionLiteralEdit";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

export class ScuffrSvgInputLiteral extends ScuffrSvgInputBase<ScuffrSvgText> implements ScuffrSvgInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    private _input: BlockInputLiteral;

    public constructor(reference: ScuffrReferenceInput, value: BlockInputLiteral) {
        super(reference, {
            shape: ScuffrSvgInputLiteral.shape,
            categoryClasses: [],
            typeClasses: ["scuff-input"]
        });
        this._input = value;
        this.content.text = this._input.value;
    }

    protected createContent(): ScuffrSvgText {
        return new ScuffrSvgText(this, "");
    }

    public setValue(value: string) {
        this._input.value = value;
        this.content.setText(value);
    }

    public getValue() {
        return this.content.text;
    }

    public isValueValid(): boolean {
        return !!this.inputType.isValidValue(this.parent.block, this._input);
    }

    public override onClick(event: MouseEvent): boolean {
        event.preventDefault();
        this.workspace.startInteraction(new ScuffrInteractionLiteralEdit(this));
        return true;
    }

    public asInput(): BlockInput {
        return this._input;
    }
}
