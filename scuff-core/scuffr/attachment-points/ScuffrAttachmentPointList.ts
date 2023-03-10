import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";

export class ScuffrAttachmentPointList<TPoint extends ScuffrAttachmentPoint = ScuffrAttachmentPoint> {
    public readonly list: TPoint[];
    public root: ScuffrElementScriptRoot | null;

    public constructor(root: ScuffrElementScriptRoot) {
        this.list = [];
        this.root = root;
        this.root.workspace.attachmentPoints.add(this);
    }

    public clear() {
        this.list.length = 0;
    }

    public push(point: TPoint) {
        this.list.push(point);
    }

    public delete() {
        if (!this.root)
            return;
        this.root.workspace.attachmentPoints.delete(this);
        this.root = null;
    }

    public recalculateTranslation() {
        for (const point of this.list)
            point.recalculateTranslation();
    }

    public onAncestryChange(root: ScuffrElementScriptRoot | null) {
        if (root === null) {
            this.delete();
        } else {
            if (this.root === null && root)
                root.workspace.attachmentPoints.add(this);
            this.root = root;
            this.recalculateTranslation();
        }
    }
}
