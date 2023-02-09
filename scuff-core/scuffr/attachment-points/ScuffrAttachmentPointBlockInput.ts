import type { BlockPartInput } from "../../block/BlockPartInput";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { ScuffrElementInput } from "../ScuffrElementInput";
import { ScuffrElementBlockInstance } from "../ScuffrElementBlockInstance";
import { ScuffrElementBlockContent } from "../ScuffrElementBlockContent";
import { ScuffrElementScriptRoot } from "../ScuffrElementScriptRoot";

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
        return this.input.isValidValue(script.script.blocks[0]) !== null;
    }

    public takeScript(script: ScuffrElementScriptRoot): void {
        const replacedInput = this.block.getInput(this.input);
        this.block.setInput(this.input, script.children[0] as ScuffrElementBlockInstance);

        if (replacedInput instanceof ScuffrElementBlockInstance) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScuffrElementBlockContent)
                rootBlock = rootBlock.parent.parent;
            replacedInput.translationParent = {
                x: rootBlock.getAbsoluteTranslation().x - this.block.getAbsoluteTranslation().x + rootBlock.rightOffset + 10,
                y: 0
            }
            replacedInput.attachmentPoints.clear();
            const renderedScript = new ScuffrElementScriptRoot(replacedInput.workspace, null, [replacedInput]);
            replacedInput.workspace.addRenderedScript(renderedScript);
        }

        script.workspace.deleteRenderedScript(script, false);
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