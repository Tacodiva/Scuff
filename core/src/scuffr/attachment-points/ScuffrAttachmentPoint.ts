import type { ScuffrSvgElement } from "../svg/ScuffrSvgElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrAttachmentPointList } from "./ScuffrAttachmentPointList";
import type { ScuffrCmd } from "../commands";

export abstract class ScuffrAttachmentPoint {
    public abstract readonly parent: ScuffrSvgElement;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScuffrSvgScriptRoot): Vec2 {
        return this._calculateRawDelta(source);
    }
    
    protected _calculateRawDelta(source: ScuffrSvgScriptRoot): Vec2 {
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
            x: absTrans.x - this.root.translationX + this.offset.x + this.parent.leftOffset,
            y: absTrans.y - this.root.translationY + this.offset.y
        };
    }

    public abstract get root(): ScuffrSvgScriptRoot;

    public abstract canTakeScript(script: ScuffrSvgScriptRoot): boolean;
    public abstract takeScriptCommand(script: ScuffrSvgScriptRoot): ScuffrCmd;

    public abstract highlight(script: ScuffrSvgScriptRoot) : void;
    public abstract unhighlight(script: ScuffrSvgScriptRoot) : void;
}

export interface IScuffrPointAttachable extends ScuffrSvgElement {
    attachmentPoints: ScuffrAttachmentPointList;
}

