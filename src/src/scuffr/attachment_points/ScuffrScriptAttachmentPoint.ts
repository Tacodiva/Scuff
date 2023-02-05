import { BlockInputTypeSubscript } from "../../block/BlockInputTypeSubscript";
import type { BlockScript } from "../../block/BlockScript";
import type { Vec2 } from "../../utils/Vec2";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrScriptElement } from "../ScuffrScriptElement";
import type { ScuffrRootScriptElement } from "../ScuffrRootScriptElement";

export class ScuffrScriptAttachmentPoint extends ScuffrAttachmentPoint {
    public readonly parent: ScuffrScriptElement<BlockScript>;
    public readonly index: number;

    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(script: ScuffrScriptElement<BlockScript>, index: number, requireStackUp: boolean, requireStackDown: boolean, offset: Vec2) {
        super(offset);
        this.parent = script;
        this.index = index;
        this.requireStackUp = requireStackUp;
        this.requireStackDown = requireStackDown;
    }

    public canTakeScript(script: ScuffrRootScriptElement): boolean {
        if (this.requireStackUp) {
            const firstBlock = script.script.blocks[0];
            if (!firstBlock.type.canStackUp(firstBlock))
                return false;
        }
        if (this.requireStackDown) {
            const lastBlock = script.script.blocks[script.script.blocks.length - 1];
            if (!lastBlock.type.canStackDown(lastBlock))
                return false;
        }
        return true;
    }

    public takeScript(script: ScuffrRootScriptElement): void {
        const firstBlock = script.getBlockInstanceElement(0);
        if (firstBlock)
            for (const input of firstBlock.block.type.inputs) {
                if (input instanceof BlockInputTypeSubscript) {
                    const firstScript = firstBlock.block.getInput(input);
                    if (firstScript.blocks.length === 0) {
                        // TODO Check distance to see if we should wrap or just place
                        this.parent.wrapScript(this.index, script, firstBlock, input);
                        return;
                    }
                    break;
                }
            }
        this.parent.insertScript(this.index, script);
    }

    public override calculateDelta(source: ScuffrRootScriptElement): Vec2 {
        const delta = super.calculateDelta(source);
        if (delta.y < 0) {
            delta.y -= source.topOffset;
        } else {
            delta.y -= source.bottomOffset;
        }
        return delta;
    }

    public get root(): ScuffrRootScriptElement {
        return this.parent.getRoot();
    }

    public highlight(): void {
    }

    public unhighlight(): void {
    }
}