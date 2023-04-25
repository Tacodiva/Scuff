import { ScuffrSvgText, type ScuffrSvgBlockContent, type ScuffrSvgScriptRoot } from "..";
import type { BlockInput } from "../../block";
import type { BlockInputStatic } from "../../block/BlockInputStatic";
import type { ScuffrReference, ScuffrReferenceable } from "../ScuffrReference";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import type { ScuffrAttachmentPoint } from "../attachment-points/ScuffrAttachmentPoint";
import { ScuffrAttachmentPointList } from "../attachment-points/ScuffrAttachmentPointList";
import { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";

export class ScuffrSvgInputStatic extends ScuffrSvgElementParent implements ScuffrSvgInput {
    private _reference: ScuffrReferenceInput;
    public override get parent(): ScuffrSvgBlockContent { return this._reference.parent; }
    public override children: readonly [ScuffrSvgText];

    private _input: BlockInputStatic;
    public readonly attachmentPoints: ScuffrAttachmentPointList<ScuffrAttachmentPoint>;

    public constructor(reference: ScuffrReferenceInput, value: BlockInputStatic) {
        super(reference.parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), reference.parent.workspace);
        this._reference = reference;
        this._input = value;
        this.children = [new ScuffrSvgText(this, value.text)];
        this.attachmentPoints = new ScuffrAttachmentPointList(reference.parent.root);
    }

    public override update(propagateUp: boolean) {
        this.dimensions.x = this.children[0].dimensions.x;
        this.dimensions.y = this.children[0].dimensions.y;
        super.update(propagateUp);
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null): void {
        this.attachmentPoints.onAncestryChange(root);
    }

    public asInput(): BlockInput {
        return this._input;
    }

    public setParent(reference: ScuffrReferenceInput): void {
        this._reference = reference;
        this.onAncestryChange(this._reference.parent.root);
    }

    public getReference(): ScuffrReference<ScuffrReferenceable> {
        return this._reference;
    }
}