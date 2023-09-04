import type { ScuffrSvgElement } from "../svg/ScuffrSvgElement";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrAttachmentPointList } from "./ScuffrAttachmentPointList";
import type { ScuffrCmd } from "../commands";
import type { MutVec2, Vec2 } from "@scuff/core";
import type { ScuffEditorInteractionDrag } from "../../editor/ScuffEditorInteractionDrag";

export abstract class ScuffrAttachmentPoint<T extends ScuffEditorInteractionDrag = ScuffEditorInteractionDrag> {
    public abstract readonly parent: ScuffrPointAttachable;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScuffrSvgScriptRoot): Vec2 {
        return this._calculateRawDelta(source);
    }

    protected _calculateRawDelta(source: ScuffrSvgScriptRoot): MutVec2 {
        return {
            x: this.translation.x + this.root.translationX - source.translationX,
            y: this.translation.y + this.root.translationY - source.translationY
        };
    }

    public get translation(): Vec2 {
        if (this._translation !== null) return this._translation;
        return this.recalculateTranslation();
    }

    public recalculateTranslation(): Vec2 {
        const absTrans = this.parent.getAbsoluteTranslation();
        return this._translation = {
            x: absTrans.x - this.root.translationX + this.offset.x + this.parent.leftOffset,
            y: absTrans.y - this.root.translationY + this.offset.y
        };
    }

    public abstract get root(): ScuffrSvgScriptRoot;

    public abstract canAttach(drag: ScuffEditorInteractionDrag): drag is T;
    public abstract attach(drag: T): ScuffrCmd;

    public abstract highlight(drag: T): void;
    public abstract unhighlight(drag: T): void;
}

export interface ScuffrPointAttachable extends ScuffrSvgElement {
    attachmentPoints?: ScuffrAttachmentPointList;
}

