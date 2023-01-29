import type { BlockInputType, IBlockInput } from "../../block/BlockInputType";
import type { BlockInstance } from "../../block/BlockInstance";
import { ScruffrAttachmentPoint, type IScruffrPointAttachable } from ".";
import { ScruffrBlockContentElement, ScruffrBlockInstanceElement } from "../ScruffrBlockInstanceElement";
import { ScruffrRootScriptElement } from "../ScruffrScriptElement";

export class ScruffrBlockInputAttachmentPoint extends ScruffrAttachmentPoint {
    public readonly block: ScruffrBlockInstanceElement;
    public readonly input: BlockInputType<IBlockInput | BlockInstance>;
    public readonly parent: IScruffrPointAttachable;

    public constructor(block: ScruffrBlockInstanceElement, input: BlockInputType<IBlockInput | BlockInstance>, part: IScruffrPointAttachable) {
        super();
        this.parent = part;
        this.block = block;
        this.input = input;
        this.parent.attachmentPoints.push(this);
    }

    public canTakeScript(script: ScruffrRootScriptElement): boolean {
        if (script.children.length !== 1) return false;
        return this.input.isValidValue(script.children[0].block) !== null;
    }

    public takeScript(script: ScruffrRootScriptElement): void {
        const replacedInput = this.block.getInput(this.input);
        this.block.setInput(this.input, script.children[0]);

        if (replacedInput instanceof ScruffrBlockInstanceElement) {
            let rootBlock = this.block;
            while (rootBlock.parent instanceof ScruffrBlockContentElement)
                rootBlock = rootBlock.parent.parent;
            replacedInput.translationParent = {
                x: rootBlock.getAbsoluteTranslation().x - this.block.getAbsoluteTranslation().x + rootBlock.rightOffset + 10,
                y: 0
            }
            replacedInput.attachmentPoints.clear();
            const renderedScript = new ScruffrRootScriptElement(replacedInput.workspace, [replacedInput]);
            replacedInput.workspace.addRenderedScript(renderedScript);
        }

        script.workspace.deleteRenderedScript(script, false);
    }

    public get root() {
        return this.block.root;
    }
}