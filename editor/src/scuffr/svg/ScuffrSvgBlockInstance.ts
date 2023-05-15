import type { ScuffrSvgBlockPart } from "./ScuffrSvgBlockPart";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import { ScuffrSvgBlockContent } from "./ScuffrSvgBlockContent";
import type { ScuffrShapeContentLine } from "../shape/ScuffrShapeContentLine";
import type { ScuffrReferenceBlock, ScuffrReferenceParentBlock } from "../ScuffrReferenceTypes";
import { ScuffrSvgScriptInput } from "./ScuffrSvgScriptInput";
import { ScuffEditorInteractionCtxMenu } from "../../editor/ScuffEditorInteractionCtxMenu";
import { l10n, type BlockInstance } from "@scuff/core";
import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import { ScuffrSvgShape } from "./ScuffrSvgShape";
import { ScuffrAttachmentPointList } from "../attachment-points/ScuffrAttachmentPointList";
import { BlockTypeComponentRenderer } from "../../BlockInputRenderer";
import type { ScuffrColouredShape } from "../shape";

export class ScuffrSvgBlockInstance extends ScuffrSvgShape<ScuffrSvgBlockContent> implements ScuffrSvgBlockPart, ScuffrSvgBlock {
    public readonly block: BlockInstance;
    public readonly renderer: BlockTypeComponentRenderer;
    public reference: ScuffrReferenceBlock;
    public get parent(): ScuffrReferenceParentBlock { return this.reference.parent; }

    public readonly attachmentPoints: ScuffrAttachmentPointList;
    public root: ScuffrSvgScriptRoot;

    public constructor(block: BlockInstance, parentRef: ScuffrReferenceBlock) {
        var renderer = block.type.getRequiredComponent(BlockTypeComponentRenderer);
        super(parentRef.parent.getRoot(), renderer.getBackground(block));
        this.renderer = renderer;
        this.reference = parentRef;
        this.block = block;
        this.root = parentRef.parent.getRoot();
        this.attachmentPoints = new ScuffrAttachmentPointList(this.root);
        this.content.renderAll();
    }

    public getReferenceValue(index: number): ScuffrSvgBlockPart {
        return this.content.getReferenceValue(index);
    }

    public getReference(): ScuffrReferenceBlock {
        return this.reference;
    }

    protected createContent(): ScuffrSvgBlockContent {
        return new ScuffrSvgBlockContent(this);
    }

    public setParent(reference: ScuffrReferenceBlock) {
        this.reference = reference;
        this.onAncestryChange(reference.parent.getRoot());
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null): void {
        if (root !== null) this.root = root;
        this.attachmentPoints.onAncestryChange(root);
        for (const child of this.content.children) {
            if (child.onAncestryChange) child.onAncestryChange(root);
        }
    }

    public override onDrag(event: MouseEvent): boolean {
        return this.parent.onChildBlockDrag(this.reference, event);
    }

    public override getContentLines(): (ScuffrShapeContentLine & { part?: ScuffrSvgBlockPart })[] {
        const lines: (ScuffrShapeContentLine & { part?: ScuffrSvgBlockPart })[] = [];
        let lineContent: ScuffrSvgBlockPart[] | null = null;
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

    public shouldAttachUp(): boolean {
        return this.block.type.canStackUp(this.block);
    }

    public shouldAttachDown(): boolean {
        return this.block.type.canStackDown(this.block);
    }

    public override onTranslationUpdate(): void {
        super.onTranslationUpdate();
        this.attachmentPoints.recalculateTranslation();
    }

    public getWrapperInput(checkEmpty: boolean = true): ScuffrSvgScriptInput | null {
        for (const inputElement of this.content.children) {
            if (inputElement instanceof ScuffrSvgScriptInput) {
                if (checkEmpty && inputElement.children.length !== 0)
                    return null;
                return inputElement;
            }
        }
        return null;
    }

    public getBackground(): ScuffrColouredShape {
        return this.shape;
    }

    public override onRightClick(event: MouseEvent): boolean {
        new ScuffEditorInteractionCtxMenu(this.workspace.editor, event, [
            {
                type: "action",
                text: l10n.raw("Duplicate"),
                action: (event) => {
                    // this.workspace.dragBlock(this.block.clone(), event);
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
        ], [...this.shape.categoryClasses, "scuff-context-menu-block"])
            .start();
        return true;
    }
}