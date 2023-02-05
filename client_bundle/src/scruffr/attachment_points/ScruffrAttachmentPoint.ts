import type { ScruffrElement } from "../ScruffrElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScruffrRootScriptElement } from "../ScruffrRootScriptElement";
import type { ScruffrAttachmentPointList } from "./ScruffrAttachmentPointList";

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

    public abstract highlight() : void;
    public abstract unhighlight() : void;
}

export interface IScruffrPointAttachable extends ScruffrElement {
    attachmentPoints: ScruffrAttachmentPointList;
}

