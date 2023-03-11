import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementInputBase } from "./ScuffrElementBlockInputBase";
import { ScuffrElementText } from "./ScuffrElementText";
import type { BlockInputLiteral } from "../block/BlockInputLiteral";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import { ScuffrShapeInputRound } from "./shape/ScuffrShapeInputRound";
import type { ScuffrShape } from "./shape";
import { ScuffrInteractionLiteralEdit } from "./interactions/ScuffrInteractionLiteralEdit";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

export class ScuffrElementInputLiteral extends ScuffrElementInputBase<ScuffrElementText> implements ScuffrElementInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    private _input: BlockInputLiteral;

    public constructor(reference: ScuffrReferenceInput, value: BlockInputLiteral) {
        super(reference, {
            shape: ScuffrElementInputLiteral.shape,
            categoryClasses: [],
            typeClasses: ["scuff-input"]
        });
        this._input = value;
        this.content.text = this._input.value;
    }

    protected createContent(): ScuffrElementText {
        return new ScuffrElementText(this, "");
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
