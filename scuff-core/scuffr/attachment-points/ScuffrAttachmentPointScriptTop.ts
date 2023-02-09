
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrElementScript } from "../ScuffrElementScript";
import type { ScuffrWrappingDescriptor } from "../ScuffrWrappingDescriptor";
import { ScuffrAttachmentPointScript } from "./ScuffrAttachmentPointScript";

export class ScuffrAttachmentPointScriptTop extends ScuffrAttachmentPointScript {

    public constructor(script: ScuffrElementScript, offset: Vec2) {
        super(script, 0, false, true, offset);
    }

    public override calculateDelta(source: ScuffrElementScriptRoot): Vec2 {
        const delta = this._calculateRawDelta(source);
        delta.y -= source.bottomOffset;
        return delta;
    }

    public override highlight(script: ScuffrElementScriptRoot): void {
        this.parent.addGhost(this.index, script.children[script.children.length - 1] as ScuffrElementBlockInstance);
    }

    protected override _getWrapping(script: ScuffrElementScriptRoot): ScuffrWrappingDescriptor | null {
        return null;
    }
}