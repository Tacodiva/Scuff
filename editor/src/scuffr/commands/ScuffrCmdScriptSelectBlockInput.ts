import type { ScuffrSvgBlock } from "../svg/ScuffrSvgBlock";
import { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import type { ScuffrLinkReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import type { ScuffrReferenceBlock } from "../ScuffrReferenceTypes";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";
import type { Vec2 } from "@scuff/core";
import type { ScuffrSvgBlockPart } from "../svg/ScuffrSvgBlockPart";

export class ScuffrCmdScriptSelectBlockInput implements ScuffrCmdScriptSelect {
    public source: ScuffrReferenceChain<ScuffrSvgBlockPart>;
    public get root() { return this.source.root; }

    public targetPosition: Vec2;

    public constructor(source: ScuffrReferenceBlock, position: Vec2) {
        this.source = new ScuffrReferenceChain<ScuffrSvgBlockPart>(source);
        this.targetPosition = position;
    }

    private _getSourceReference(): ScuffrLinkReference<ScuffrSvgBlockPart, ScuffrSvgBlockInstance> {
        const reference = this.source.getTerminalReference();
        if (!(reference.parent instanceof ScuffrSvgBlockInstance))
            throw new Error("ScuffrCommandBlockDetachBlock only valid for block instance children.");
        return reference as any;
    }

    public do() {
        const source = this._getSourceReference();
        const block = source.parent.content.detachBlock(source.index);
        this.root.createScript([block], this.targetPosition);
    }

    public undo() {
        const source = this._getSourceReference();
        const script = this.root.getSelectedScript();
        source.parent.content.setInputByIndex(source.index, script.children[0] as ScuffrSvgBlockInstance);
        this.root.deleteScript(script, false);
    }
}