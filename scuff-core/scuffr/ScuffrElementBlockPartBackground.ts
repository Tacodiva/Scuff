import type { IScuffrPointAttachable } from "./attachment-points/ScuffrAttachmentPoint";
import { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrElementShape } from "./ScuffrElementShape";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrColouredShape } from "./shape/ScuffrColouredShape";

export abstract class ScuffrElementBlockPartBackground<TContent extends ScuffrElement> extends ScuffrElementShape<TContent> implements ScuffrElementBlockPart, IScuffrPointAttachable {
    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public root: ScuffrElementScriptRoot;

    public constructor(root: ScuffrElementScriptRoot, parent: ScuffrElementParent, background: ScuffrColouredShape) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScuffrAttachmentPointList(root);
    }

    public getBackground(): ScuffrColouredShape {
        return this.shape;
    }

    public onAncestryChange(root: ScuffrElementScriptRoot | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        this.attachmentPoints.recalculateTranslation();
    }
}