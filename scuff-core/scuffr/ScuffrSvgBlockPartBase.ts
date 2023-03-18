import type { IScuffrPointAttachable } from "./attachment-points/ScuffrAttachmentPoint";
import { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrSvgShape } from "./ScuffrSvgShape";
import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgElement } from "./ScuffrSvgElement";
import type { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import type { ScuffrColouredShape } from "./shape/ScuffrColouredShape";

export abstract class ScuffrSvgBlockPartBase<TContent extends ScuffrSvgElement> extends ScuffrSvgShape<TContent> implements ScuffrSvgBlockPart, IScuffrPointAttachable {
    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public root: ScuffrSvgScriptRoot;

    public constructor(root: ScuffrSvgScriptRoot, parent: ScuffrSvgElementParent, background: ScuffrColouredShape) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScuffrAttachmentPointList(root);
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