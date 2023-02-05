import type { IScuffrPointAttachable } from "./attachment_points/ScuffrAttachmentPoint";
import { ScuffrAttachmentPointList } from "./attachment_points/ScuffrAttachmentPointList";
import type { ScuffrBackground } from "./background/ScuffrBackground";
import { ScuffrBackgroundElement } from "./background/ScuffrBackgroundElement";
import type { IScuffrBlockPartElement } from "./IScuffrBlockPartElement";
import type { ScuffrElement } from "./ScuffrElement";
import type { ScuffrParentElement } from "./ScuffrParentElement";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";

export abstract class ScuffrBackgroundedBlockPartElement<TContent extends ScuffrElement> extends ScuffrBackgroundElement<TContent> implements IScuffrBlockPartElement, IScuffrPointAttachable {
    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public root: ScuffrRootScriptElement;

    public constructor(root: ScuffrRootScriptElement, parent: ScuffrParentElement, background: ScuffrBackground) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScuffrAttachmentPointList(root);
    }

    public getBackground(): ScuffrBackground {
        return this.background;
    }

    public onAncestryChange(root: ScuffrRootScriptElement | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }
}