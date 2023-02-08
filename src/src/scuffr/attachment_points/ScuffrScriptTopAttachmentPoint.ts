
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrBlockInstanceElement } from "../ScuffrBlockInstanceElement";
import type { ScuffrRootScriptElement } from "../ScuffrRootScriptElement";
import type { ScuffrScriptElement } from "../ScuffrScriptElement";
import type { ScuffrWrappingDescriptor } from "../ScuffrWrappingDescriptor";
import { ScuffrScriptAttachmentPoint } from "./ScuffrScriptAttachmentPoint";

export class ScuffrScriptTopAttachmentPoint extends ScuffrScriptAttachmentPoint {

    public constructor(script: ScuffrScriptElement, offset: Vec2) {
        super(script, 0, false, true, offset);
    }

    public override calculateDelta(source: ScuffrRootScriptElement): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.bottomOffset;
        return delta;
    }

    public override highlight(script: ScuffrRootScriptElement): void {
        this.parent.addGhost(this.index, script.children[script.children.length - 1] as ScuffrBlockInstanceElement);
    }

    protected override _getWrapping(script: ScuffrRootScriptElement): ScuffrWrappingDescriptor | null {
        return null;
    }
}