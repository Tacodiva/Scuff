import type { ScuffrPointAttachable } from "../attachment-points/ScuffrAttachmentPoint";
import { ScuffrAttachmentPointList } from "../attachment-points/ScuffrAttachmentPointList";
import { ScuffrSvgShape } from "./ScuffrSvgShape";
import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "../shape/ScuffrColouredShape";
import type { ScuffrReference, ScuffrReferenceable } from "../ScuffrReference";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import type { ScuffrSvgBlockContent } from "./ScuffrSvgBlockContent";
import type { ScuffrSvgShapeContent } from "./ScuffrSvgShapeContent";

export abstract class ScuffrSvgBlockPartBase<TContent extends ScuffrSvgShapeContent> extends ScuffrSvgShape<TContent> implements ScuffrSvgBlockPart {
    public parent: ScuffrSvgBlockContent;
    public readonly attachmentPoints: ScuffrAttachmentPointList;
    private _reference: ScuffrReferenceInput;
    public root: ScuffrSvgScriptRoot;

    public constructor(reference: ScuffrReferenceInput, background: ScuffrColouredShape) {
        super(reference.parent, background);
        this.parent = reference.parent;
        this.root = reference.parent.root;
        this._reference = reference;
        this.attachmentPoints = new ScuffrAttachmentPointList(this.root);
    }

    public setParent(reference: ScuffrReferenceInput): void {
        this._reference = reference;
        this.onAncestryChange(this._reference.parent.root);
    }

    public getReference(): ScuffrReferenceInput {
        return this._reference;
    }

    public getBackground(): ScuffrColouredShape {
        return this.shape;
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        this.attachmentPoints.recalculateTranslation();
    }
}