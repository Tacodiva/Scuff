import type { ScruffrElement } from "../ScruffrElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrRootScriptElement } from "../ScruffrScriptElement";

export class ScruffrAttachmentPointList<TPoint extends ScruffrAttachmentPoint = ScruffrAttachmentPoint> {
    public readonly list: TPoint[];
    public root: ScruffrRootScriptElement | null;

    public constructor(root: ScruffrRootScriptElement) {
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
        if (!this.root) return;
        this.root.workspace.attachmentPoints.delete(this);
        this.root = null;
    }

    public recalculateTranslation() {
        for (const point of this.list)
            point.recalculateTranslation();
    }

    public onAncestryChange(root: ScruffrRootScriptElement | null) {
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

export abstract class ScruffrAttachmentPoint {
    public abstract readonly parent: ScruffrElement;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScruffrRootScriptElement): Vec2 {
        return {
            x: this.translation.x + this.root.translationX - source.translationX,
            y: this.translation.y + this.root.translationY - source.translationY
        };
    }

    public get translation(): Vec2 {
        if (this._translation !== null) return this._translation;
        return this.recalculateTranslation();
    }

    public recalculateTranslation() {
        const absTrans = this.parent.getAbsoluteTranslation();
        return this._translation = {
            x: absTrans.x - this.root.translationX + this.offset.x,
            y: absTrans.y - this.root.translationY + this.offset.y
        };
    }

    public abstract get root(): ScruffrRootScriptElement;

    public abstract canTakeScript(script: ScruffrRootScriptElement): boolean;
    public abstract takeScript(script: ScruffrRootScriptElement): void;
}

export interface IScruffrPointAttachable extends ScruffrElement {
    attachmentPoints: ScruffrAttachmentPointList;
}

