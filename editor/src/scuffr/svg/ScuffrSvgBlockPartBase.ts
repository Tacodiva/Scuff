import { ScuffrAttachmentPointList } from "../attachment-points/ScuffrAttachmentPointList";
import { ScuffrSvgShape } from "./ScuffrSvgShape";
import type { ScuffrSvgBlockPart, ScuffrSvgBlockPartCloneFactory } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "../shape/ScuffrColouredShape";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import type { ScuffrSvgBlockContent } from "./ScuffrSvgBlockContent";
import type { ScuffrSvgShapeContent } from "./ScuffrSvgShapeContent";
import type { ScuffrAttachmentPoint } from "../attachment-points/ScuffrAttachmentPoint";
import type { ScuffrShapeModifier } from "../shape";

export abstract class ScuffrSvgBlockPartBase<TContent extends ScuffrSvgShapeContent> extends ScuffrSvgShape<TContent> implements ScuffrSvgBlockPart {
    public parent: ScuffrSvgBlockContent;
    public attachmentPoints: ScuffrAttachmentPointList | undefined;
    private _reference: ScuffrReferenceInput;
    public root: ScuffrSvgScriptRoot;

    public constructor(reference: ScuffrReferenceInput, background: ScuffrColouredShape) {
        super(reference.parent, background);
        this.parent = reference.parent;
        this.root = reference.parent.root;
        this._reference = reference;
    }

    public addAttachmentPoint(point: ScuffrAttachmentPoint): number {
        if (!this.attachmentPoints)
            this.attachmentPoints = new ScuffrAttachmentPointList(this.root);
        this.attachmentPoints.push(point);
        return this.attachmentPoints.list.length - 1;
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
        this.attachmentPoints?.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        this.attachmentPoints?.recalculateTranslation();
    }

    public abstract createCloneFactory(): ScuffrSvgBlockPartCloneFactory;
}