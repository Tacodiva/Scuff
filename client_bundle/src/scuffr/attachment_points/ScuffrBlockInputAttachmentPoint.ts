import type { BlockInputType } from "../../block/BlockInputType";
import { ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { IScuffrBlockInput } from "../IScuffrBlockInput";
import { ScuffrBlockInstanceElement } from "../ScuffrBlockInstanceElement";
import { ScuffrRootScriptElement } from "../ScuffrRootScriptElement";
import { ScuffrBlockContentElement } from "../ScuffrBlockContentElement";

export class ScuffrBlockInputAttachmentPoint extends ScuffrAttachmentPoint {
    public readonly block: ScuffrBlockInstanceElement;
    public readonly input: BlockInputType;
    public readonly parent: IScuffrBlockInput;

    public constructor(block: ScuffrBlockInstanceElement, input: BlockInputType, part: IScuffrBlockInput) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScuffrRootScriptElement): boolean {
        if (script.children.length !== 1) return false;
        return this.input.isValidValue(script.script.blocks[0]) !== null;
    }

    public takeScript(script: ScuffrRootScriptElement): void {
        const replacedInput = this.block.getInput(this.input);
        this.block.setInput(this.input, script.children[0] as ScuffrBlockInstanceElement);

        if (replacedInput instanceof ScuffrBlockInstanceElement) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScuffrBlockContentElement)
                rootBlock = rootBlock.parent.parent;
            replacedInput.translationParent = {
                x: rootBlock.getAbsoluteTranslation().x - this.block.getAbsoluteTranslation().x + rootBlock.rightOffset + 10,
                y: 0
            }
            replacedInput.attachmentPoints.clear();
            const renderedScript = new ScuffrRootScriptElement(replacedInput.workspace, null, [replacedInput]);
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