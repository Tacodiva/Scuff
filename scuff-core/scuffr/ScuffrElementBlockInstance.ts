import type { BlockInstance } from "../block/BlockInstance";
import { ScuffrElementBlockPartBackground } from "./ScuffrElementBlockPartBackground";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementBlockPart } from "./ScuffrElementBlockPart";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import type { ScuffrBlockReference, ScuffrBlockReferenceParent } from "./ScuffrBlockReference";
import type { BlockPartInput } from "../block/BlockPartInput";
import type { ScuffrShapeContentLine } from "./shape/ScuffrShapeContentLine";
import { ScuffrInteractionContextMenu } from "./interactions/ScuffrInteractionContextMenu";
import { l10n } from "../l10n";

export class ScuffrElementBlockInstance extends ScuffrElementBlockPartBackground<ScuffrElementBlockContent> implements ScuffrElementBlock, ScuffrElementInput {
    public readonly block: BlockInstance;
    public parentRef: ScuffrBlockReference;
    public get parent(): ScuffrBlockReferenceParent { return this.parentRef.parent; }

    public constructor(block: BlockInstance, parentRef: ScuffrBlockReference) {
        super(parentRef.parent.getRoot(), parentRef.parent, block.type.getBackground(block));
        this.parentRef = parentRef;
        this.block = block;
        this.content.renderAll();
    }

    protected createContent(): ScuffrElementBlockContent {
        return new ScuffrElementBlockContent(this);
    }

    public setParent(parentRef: ScuffrBlockReference) {
        this.parentRef = parentRef;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public override onAncestryChange(root: ScuffrElementScriptRoot | null): void {
        super.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parentRef.onDrag(event);
    }

    public getInput(key: BlockPartInput): ScuffrElementInput | null {
        return this.content.getInput(key)?.element ?? null;
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