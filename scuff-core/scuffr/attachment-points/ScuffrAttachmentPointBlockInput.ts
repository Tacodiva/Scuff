import type { BlockPartInput } from "../../block/BlockPartInput";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrSvgInput } from "../svg/ScuffrSvgInput";
import { ScuffrCmdAttchInputTakeScript } from "../commands/ScuffrCmdAttchInputTakeScript";
import { ScuffrSvgBlockInstance } from "../svg/ScuffrSvgBlockInstance";
import { ScuffrSvgBlockContent } from "../svg/ScuffrSvgBlockContent";
import { ScuffrCmdScriptSelectBlockInput } from "../commands/ScuffrCmdScriptSelectBlockInput";
import { ScuffrCmdCompound } from "../commands/ScuffrCmdCompound";
import type { ScuffrSvgScriptRoot } from "../svg/ScuffrSvgScriptRoot";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdScriptSwapSelected } from "../commands/ScuffrCmdScriptSwapSelected";

export class ScuffrAttachmentPointBlockInput extends ScuffrAttachmentPoint {
    public readonly block: ScuffrSvgBlockInstance;
    public readonly input: BlockPartInput;
    public readonly parent: ScuffrSvgInput;

    public constructor(block: ScuffrSvgBlockInstance, input: BlockPartInput, part: ScuffrSvgInput) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScuffrSvgScriptRoot): boolean {
        if (script.children.length !== 1) return false;
        return !!this.input.isValidValue(this.block.block, script.script.blocks[0]);
    }

    public takeScriptCommand(script: ScuffrSvgScriptRoot): ScuffrCmd {
        let cmd: ScuffrCmd = new ScuffrCmdAttchInputTakeScript(this.parent.getReference());

        const replacedInput = this.block.getInput(this.input);
        if (replacedInput instanceof ScuffrSvgBlockInstance) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScuffrSvgBlockContent)
                rootBlock = rootBlock.parent.parent;
            replacedInput.attachmentPoints.clear();
            const rootTranslation = { ...rootBlock.getAbsoluteTranslation() };
            rootTranslation.x += rootBlock.leftOffset - replacedInput.rightOffset - 40;
            cmd = new ScuffrCmdCompound(
                new ScuffrCmdScriptSelectBlockInput(replacedInput.getReference(), rootTranslation),
                new ScuffrCmdScriptSwapSelected(1, cmd.root),
                cmd
            );
        }

        return cmd;
    }

    public get root() {
        return this.block.root;
    }

    public highlight(): void {
        this.parent.dom.classList.add("scuff-input-highlight");
    }

    public unhighlight(): void {
        this.parent.dom.classList.remove("scuff-input-highlight");
    }

}