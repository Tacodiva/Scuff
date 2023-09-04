import { ScuffrSvgText } from "./ScuffrSvgText";
import { ScuffrShapeInputRound } from "../shape/ScuffrShapeInputRound";
import type { ScuffrShape } from "../shape";
import { ScuffrInteractionLiteralEdit } from "../interactions/ScuffrInteractionLiteralEdit";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import { ScuffrSvgBlockPartBase } from "./ScuffrSvgBlockPartBase";
import type { ScuffrSvgBlockContent, ScuffrSvgElementParent } from "..";
import type { ScuffrSvgBlockPartCloneFactory } from "./ScuffrSvgBlockPart";

export interface ScuffrProviderInputLiteral {
    getText(): string;
    setText(text: string): boolean;
}

export class ScuffrSvgInputLiteral extends ScuffrSvgBlockPartBase<ScuffrSvgText> {
    public readonly parent: ScuffrSvgBlockContent;
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    private readonly _data: ScuffrProviderInputLiteral;
    private _text: string;
    private _textValid: boolean;

    public constructor(reference: ScuffrReferenceInput, data: ScuffrProviderInputLiteral) {
        super(reference, {
            shape: ScuffrSvgInputLiteral.shape,
            categoryClasses: [],
            typeClasses: ["scuff-input"]
        });
        this.parent = reference.parent;
        this._data = data;
        this._text = this._data.getText();
        this.content.text = this._text;
        this._textValid = true;
    }

    protected createContent(): ScuffrSvgText {
        return new ScuffrSvgText(this, "");
    }

    public setText(text: string) {
        this._textValid = this._data.setText(text);
        this.content.setText(text);
    }

    public getText() {
        return this._text;
    }

    public isTextValid(): boolean {
        return this._textValid;
    }

    public override onClick(event: MouseEvent): boolean {
        event.preventDefault();
        new ScuffrInteractionLiteralEdit(this).start();
        return true;
    }

    public createCloneFactory(): ScuffrSvgBlockPartCloneFactory {
        const data = this._data;
        return (reference) => new ScuffrSvgInputLiteral(reference, data);
    }

}
