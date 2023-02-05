import type { BlockInputType } from "../../block/BlockInputType";
import { ScruffrAttachmentPoint } from "./ScruffrAttachmentPoint";
import type { IScruffrBlockInput } from "../IScruffrBlockInput";
import { ScruffrBlockInstanceElement } from "../ScruffrBlockInstanceElement";
import { ScruffrRootScriptElement } from "../ScruffrRootScriptElement";
import { ScruffrBlockContentElement } from "../ScruffrBlockContentElement";

export class ScruffrBlockInputAttachmentPoint extends ScruffrAttachmentPoint {
    public readonly block: ScruffrBlockInstanceElement;
    public readonly input: BlockInputType;
    public readonly parent: IScruffrBlockInput;

    public constructor(block: ScruffrBlockInstanceElement, input: BlockInputType, part: IScruffrBlockInput) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScruffrRootScriptElement): boolean {
        if (script.children.length !== 1) return false;
        return this.input.isValidValue(script.script.blocks[0]) !== null;
    }

    public takeScript(script: ScruffrRootScriptElement): void {
        const replacedInput = this.block.getInput(this.input);
        this.block.setInput(this.input, script.children[0] as ScruffrBlockInstanceElement);

        if (replacedInput instanceof ScruffrBlockInstanceElement) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScruffrBlockContentElement)
                rootBlock = rootBlock.parent.parent;
            replacedInput.translationParent = {
                x: rootBlock.getAbsoluteTranslation().x - this.block.getAbsoluteTranslation().x + rootBlock.rightOffset + 10,
                y: 0
            }
            replacedInput.attachmentPoints.clear();
            const renderedScript = new ScruffrRootScriptElement(replacedInput.workspace, null, [replacedInput]);
            replacedInput.workspace.addRenderedScript(renderedScript);
        }

        script.workspace.deleteRenderedScript(script, false);
    }

    public get root() {
        return this.block.root;
    }

    public highlight(): void {
        this.parent.dom.classList.add("scruff-input-highlight");
    }

    public unhighlight(): void {
        this.parent.dom.classList.remove("scruff-input-highlight");
    }

}