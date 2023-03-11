import type { BlockInstance } from "../block/BlockInstance";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import type { BlockPartInput } from "../block/BlockPartInput";
import type { ScuffrShapeContentLine } from "./shape/ScuffrShapeContentLine";
import { ScuffrInteractionContextMenu } from "./interactions/ScuffrInteractionContextMenu";
import { l10n } from "../l10n";
import type { ScuffrReferenceBlock, ScuffrReferenceParentBlock } from "./ScuffrReferenceTypes";
import { ScuffrElementBlockPartBase } from "./ScuffrElementBlockPartBase";

export class ScuffrElementBlockInstance extends ScuffrElementBlockPartBase<ScuffrElementBlockContent> implements ScuffrElementBlock, ScuffrElementInput {
    public readonly block: BlockInstance;
    public reference: ScuffrReferenceBlock;
    public get parent(): ScuffrReferenceParentBlock { return this.reference.parent; }

    public constructor(block: BlockInstance, parentRef: ScuffrReferenceBlock) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.reference = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    getIndexValue(index: number){
        throw new Error("Method not implemented.");
    }

    public getReference(): ScuffrReferenceBlock {
        return this.reference;
    }

    protected createContent(): ScuffrElementBlockContent {
        return new ScuffrElementBlockContent(this);
    }

    public setParent(reference: ScuffrReferenceBlock) {
        this.reference = reference;
        this.onAncestryChange(reference.parent.getRoot());
    }

    public override onAncestryChange(root: ScuffrElementScriptRoot | null): void {
        super.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return (this.parent.onChildDrag && this.parent.onChildDrag(this.reference.index, event)) ?? false;
    }

    public getInput(key: BlockPartInput): ScuffrElementInput | null {
        return this.content.getInput(key)?.rendered ?? null;
    }

    public setInput(key: BlockPartInput, input: ScuffrElementInput) {
        this.content.setInput(key, input);
    }

    public override getContentLines(): (ScuffrShapeContentLine & { part?: ScuffrElementBlockPart })[] {
        const lines: (ScuffrShapeContentLine & { part?: ScuffrElementBlockPart })[] = [];
        let lineContent: ScuffrElementBlockPart[] | null = null;
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

    public asInput(): BlockInput {
        return this.block;
    }

    public shouldAttachUp(): boolean {
        return this.block.type.canStackUp(this.block);
    }

    public shouldAttachDown(): boolean {
        return this.block.type.canStackDown(this.block);
    }

    public override onRightClick(event: MouseEvent): boolean {
        this.workspace.startInteraction(new ScuffrInteractionContextMenu(this.workspace, event, [
            {
                type: "action",
                text: l10n.raw("Duplicate"),
                action: (event) => {
                    this.workspace.dragBlock(this.block.clone(), event);
                }
            },
            {
                type: "action",
                text: l10n.raw("Delete Block"),
                action() {
                    console.log("Delete")
                }
            },
            {
                type: "submenu",
                text: l10n.raw("Submenu 1"),
                items: [
                    {
                        type: "action",
                        text: l10n.raw("Delete Block"),
                        action() {
                            console.log("Delete")
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "action",
                        text: l10n.raw("Duplicate"),
                        disabled: true,
                        action: (event) => {
                            console.log("Dup")
                        }
                    },
                    {
                        type: "submenu",
                        text: l10n.raw("Submenu 2"),
                        items: [
                            {
                                type: "action",
                                text: l10n.raw("Delete Block"),
                                action() {
                                    console.log("Delete")
                                }
                            },
                            {
                                type: "action",
                                text: l10n.raw("Duplicate"),
                                disabled: true,
                                action: (event) => {
                                    console.log("Dup")
                                }
                            },
                            {
                                type: "action",
                                text: l10n.raw("Something else"),
                                action() {
                                    console.log("Delete")
                                }
                            },
                        ],
                    },
                ]
            }
        ], [...this.shape.categoryClasses, "scuff-context-menu-block"]));
        return true;
    }
}