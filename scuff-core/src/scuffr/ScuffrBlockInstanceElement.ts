import type { BlockInstance } from "../block/BlockInstance";
import type { ScuffrBackgroundContentLine } from "./background/ScuffrBackground";
import { ScuffrBackgroundedBlockPartElement } from "./ScuffrBackgroundedBlockPartElement";
import type { IScuffrBlock } from "./IScuffrBlock";
import type { IScuffrBlockInput } from "./IScuffrBlockInput";
import type { IScuffrBlockPartElement } from "./IScuffrBlockPartElement";
import { ScuffrBlockContentElement } from "./ScuffrBlockContentElement";
import type { IScuffrBlockParent, ScuffrBlockRef } from "./ScuffrBlockRef";
import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";

export class ScuffrBlockInstanceElement extends ScuffrBackgroundedBlockPartElement<ScuffrBlockContentElement> implements IScuffrBlock, IScuffrBlockInput {
    public readonly block: BlockInstance;
    public parentRef: ScuffrBlockRef;
    public get parent(): IScuffrBlockParent { return this.parentRef.parent; }

    public constructor(block: BlockInstance, parentRef: ScuffrBlockRef) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.parentRef = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    protected createContent(): ScuffrBlockContentElement {
        return new ScuffrBlockContentElement(this);
    }

    public setParent(parentRef: ScuffrBlockRef) {
        this.parentRef = parentRef;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public override onAncestryChange(root: ScuffrRootScriptElement | null): void {
        super.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockInputType): IScuffrBlockInput | null {
        return this.content.getInput(key)?.element ?? null;
    }

    public setInput(key: BlockInputType, input: IScuffrBlockInput) {
        this.content.setInput(key, input);
    }

    public override getBackgroundContentLines(): (ScuffrBackgroundContentLine & { part?: IScuffrBlockPartElement })[] {
        const lines: (ScuffrBackgroundContentLine & { part?: IScuffrBlockPartElement })[] = [];
        let lineContent: IScuffrBlockPartElement[] | null = null;
        for (const part of this.content.children) {
            if (part.getBackgroundModifier) {
                if (lineContent) {
                    lines.push({ elements: lineContent, dimensions: { x: 0, y: 0 } });
                    lineContent = [];
                }
                lines.push({ elements: [part], modifier: part.getBackgroundModifier() ?? undefined, dimensions: { x: 0, y: 0 }, part });
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
