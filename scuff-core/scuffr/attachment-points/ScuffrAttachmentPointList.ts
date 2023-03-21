import type { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
import type { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";

export class ScuffrAttachmentPointList<TPoint extends ScuffrAttachmentPoint = ScuffrAttachmentPoint> {
    public readonly list: TPoint[];
    public root: ScuffrSvgScriptRoot | null;

    public constructor(root: ScuffrSvgScriptRoot) {
        this.list = [];
        this.root = root;
        this.root.scriptContainer.addAttachmentPoints(this);
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
        this.root.scriptContainer.deleteAttachmentPoints(this);
        this.root = null;
    }

    public recalculateTranslation() {
        for (const point of this.list)
            point.recalculateTranslation();
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null) {
        if (root === null) {
            this.delete();
        } else {
            if (this.root === null && root)
                root.scriptContainer.addAttachmentPoints(this);
            this.root = root;
            this.recalculateTranslation();
        }
    }
}
