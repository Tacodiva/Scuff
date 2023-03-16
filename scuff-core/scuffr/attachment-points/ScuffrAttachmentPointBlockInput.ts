import type { BlockPartInput } from "../../block/BlockPartInput";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrElementInput } from "../ScuffrElementInput";
import { ScuffrCmdAttchInputTakeScript } from "../commands/ScuffrCmdAttchInputTakeScript";
import { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import { ScuffrElementBlockContent } from "../ScuffrElementBlockContent";
import { ScuffrCmdScriptSelectBlockInput } from "../commands/ScuffrCmdScriptSelectBlockInput";
import { ScuffrCmdCompound } from "../commands/ScuffrCmdCompound";
import type { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";
import type { ScuffrCmd } from "../commands/ScuffrCmd";
import { ScuffrCmdScriptSwapSelected } from "../commands/ScuffrCmdScriptSwapSelected";

export class ScuffrAttachmentPointBlockInput extends ScuffrAttachmentPoint {
    public readonly block: ScuffrElementBlockInstance;
    public readonly input: BlockPartInput;
    public readonly parent: ScuffrElementInput;

    public constructor(block: ScuffrElementBlockInstance, input: BlockPartInput, part: ScuffrElementInput) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScuffrElementScriptRoot): boolean {
        if (script.children.length !== 1) return false;
        return !!this.input.isValidValue(this.block.block, script.script.blocks[0]);
    }

    public takeScriptCommand(script: ScuffrElementScriptRoot): ScuffrCmd {
        let cmd: ScuffrCmd = new ScuffrCmdAttchInputTakeScript(this.parent.getReference());

        const replacedInput = this.block.getInput(this.input);
        if (replacedInput instanceof ScuffrElementBlockInstance) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScuffrElementBlockContent)
                rootBlock = rootBlock.parent.parent;
            replacedInput.attachmentPoints.clear();
            const rootTranslation = { ...rootBlock.getAbsoluteTranslation() };
            rootTranslation.x += rootBlock.leftOffset - replacedInput.rightOffset - 40;
            cmd = new ScuffrCmdCompound(
                new ScuffrCmdScriptSelectBlockInput(replacedInput.getReference(), rootTranslation),
                new ScuffrCmdScriptSwapSelected(1, cmd.workspace),
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