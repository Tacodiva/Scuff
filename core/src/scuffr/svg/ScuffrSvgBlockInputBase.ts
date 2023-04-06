import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrColouredShape } from "../shape/ScuffrColouredShape";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import type { ScuffrSvgBlockContent } from "./ScuffrSvgBlockContent";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import type { BlockInput, BlockPartInput } from "../../block";
import { ScuffrSvgBlockPartBase } from "./ScuffrSvgBlockPartBase";

export abstract class ScuffrSvgInputBase<TContent extends ScuffrSvgElement> extends ScuffrSvgBlockPartBase<TContent> implements ScuffrSvgInput {
    private _reference: ScuffrReferenceInput;
    public override get parent(): ScuffrSvgBlockContent { return this._reference.parent; }

    public readonly inputType: BlockPartInput;

    public constructor(reference: ScuffrReferenceInput, background: ScuffrColouredShape) {
        super(reference.parent.root, reference.parent, background);
        this._reference = reference;
        this.inputType = reference.parent.block.type.inputs[reference.index];
    }

    abstract asInput(): BlockInput;

    public setParent(reference: ScuffrReferenceInput): void {
        this._reference = reference;
        this.onAncestryChange(this._reference.parent.root);
    }

    public getReference(): ScuffrReferenceInput {
        return this._reference;
    }
}