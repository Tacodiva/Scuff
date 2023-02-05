import type { IScruffrPointAttachable } from "./attachment_points/ScruffrAttachmentPoint";
import { ScruffrAttachmentPointList } from "./attachment_points/ScruffrAttachmentPointList";
import type { ScruffrBackground } from "./background/ScruffrBackground";
import { ScruffrBackgroundElement } from "./background/ScruffrBackgroundElement";
import type { IScruffrBlockPartElement } from "./IScruffrBlockPartElement";
import type { ScruffrElement } from "./ScruffrElement";
import type { ScruffrParentElement } from "./ScruffrParentElement";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";

export abstract class ScruffrBackgroundedBlockPartElement<TContent extends ScruffrElement> extends ScruffrBackgroundElement<TContent> implements IScruffrBlockPartElement, IScruffrPointAttachable {
    public readonly attachmentPoints: ScruffrAttachmentPointList;
    public root: ScruffrRootScriptElement;

    public constructor(root: ScruffrRootScriptElement, parent: ScruffrParentElement, background: ScruffrBackground) {
        super(parent, background);
        this.root = root;
        this.attachmentPoints = new ScruffrAttachmentPointList(root);
    }

    public getBackground(): ScruffrBackground {
        return this.background;
    }

    public onAncestryChange(root: ScruffrRootScriptElement | null) {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }
}