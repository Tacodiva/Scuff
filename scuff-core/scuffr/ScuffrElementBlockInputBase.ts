import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrColouredShape } from "./shape/ScuffrColouredShape";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { BlockInput, BlockPartInput } from "../block";
import { ScuffrElementBlockPartBase } from "./ScuffrElementBlockPartBase";

export abstract class ScuffrElementInputBase<TContent extends ScuffrElement> extends ScuffrElementBlockPartBase<TContent> implements ScuffrElementInput {
    private _reference: ScuffrReferenceInput;
    public override get parent(): ScuffrElementBlockContent { return this._reference.parent; }

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