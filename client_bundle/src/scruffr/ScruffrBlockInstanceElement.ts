import type { BlockInstance } from "../block/BlockInstance";
import type { ScruffrBackgroundContentLine } from "./background/ScruffrBackground";
import { ScruffrBackgroundedBlockPartElement } from "./ScruffrBackgroundedBlockPartElement";
import type { IScruffrBlock } from "./IScruffrBlock";
import type { IScruffrBlockInput } from "./IScruffrBlockInput";
import type { IScruffrBlockPartElement } from "./IScruffrBlockPartElement";
import { ScruffrBlockContentElement } from "./ScruffrBlockContentElement";
import type { IScruffrBlockParent, ScruffrBlockRef } from "./ScruffrBlockRef";
import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import type { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";

export class ScruffrBlockInstanceElement extends ScruffrBackgroundedBlockPartElement<ScruffrBlockContentElement> implements IScruffrBlock, IScruffrBlockInput {
    public readonly block: BlockInstance;
    public parentRef: ScruffrBlockRef;
    public get parent(): IScruffrBlockParent { return this.parentRef.parent; }

    public constructor(block: BlockInstance, parentRef: ScruffrBlockRef) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.parentRef = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    protected createContent(): ScruffrBlockContentElement {
        return new ScruffrBlockContentElement(this);
    }

    public setParent(parentRef: ScruffrBlockRef) {
        this.parentRef = parentRef;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public override onAncestryChange(root: ScruffrRootScriptElement | null): void {
        super.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockInputType): IScruffrBlockInput | null {
        return this.content.getInput(key)?.element ?? null;
    }

    public setInput(key: BlockInputType, input: IScruffrBlockInput) {
        this.content.setInput(key, input);
    }

    protected override getBackgroundContentLines(): ScruffrBackgroundContentLine[] {
        const lines: ScruffrBackgroundContentLine[] = [];
        let lineContent: IScruffrBlockPartElement[] | null = null;
        for (const part of this.content.children) {
            if (part.getBackgroundModifier) {
                if (lineContent) {
                    lines.push({ elements: lineContent, dimensions: { x: 0, y: 0 } });
                    lineContent = [];
                }
                lines.push({ elements: [part], modifier: part.getBackgroundModifier() ?? undefined, dimensions: { x: 0, y: 0 } });
            } else {
                if (!lineContent) lineContent = [];
                lineContent.push(part);
            }
        }
        if (lineContent) lines.push({ elements: lineContent, dimensions: { x: 0, y: 0 } });
        return lines;
    }

    public asInput(): IBlockInput {
        return this.block;
    }

    public shouldAttachUp(): boolean {
        return this.block.type.canStackUp(this.block);
    }

    public shouldAttachDown(): boolean {
        return this.block.type.canStackDown(this.block);
    }
}
