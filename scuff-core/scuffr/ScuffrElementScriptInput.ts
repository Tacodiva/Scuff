import { ScuffrElementScriptRoot } from "./ScuffrElementScriptRoot";
import type { BlockPartInput } from "../block/BlockPartInput";
import { BlockScriptInput } from "../block/BlockScriptInput";
import type { BlockInput } from "../block/BlockInput";
import type { Vec2 } from "../utils/Vec2";
import { ScuffrAttachmentPointScript } from "./attachment-points/ScuffrAttachmentPointScript";
import type { ScuffrShapeModifier } from "./shape/ScuffrShapeModifier";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import type { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import { ScuffrElementScript } from "./ScuffrElementScript";
import type { ScuffrShapeContentLine } from "./shape/ScuffrShapeContentLine";
import { ScuffrShapeStackBody, ScuffrShapeStackHead, ScuffrShapeStackTail } from "./shape";

export class ScuffrElementScriptInput extends ScuffrElementScript<BlockScriptInput> implements ScuffrElementInput, ScuffrShapeModifier {
    public static readonly MIN_HEIGHT = 32;
    public get isSubscript(): boolean { return true; }

    private _parent: ScuffrElementBlockContent;
    public get parent(): ScuffrElementBlockContent { return this._parent; }

    public constructor(parent: ScuffrElementBlockInstance, script: BlockScriptInput | null, blocks?: ScuffrElementBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptInput(ScuffrElementScript.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(parent.content.dom, parent.root, parent.workspace, script, blocks);
        this._parent = parent.content;
    }

    protected override _updateAttachmentPoints(): void {
        super._updateAttachmentPoints();
        this._updateDefualtAttachmentPoint();
    }

    protected override _updateBlocks(): void {
        super._updateBlocks();

        this.dimensions.x = 144;
        if (this.children.length === 0) {
            this.dimensions.y = ScuffrElementScriptInput.MIN_HEIGHT;
        } else {
            this.dimensions.x = 144;
            this.topLeftOffset.y += 4;
            this.dimensions.y += 8;
        }

        this.translationSelf.x = 8;
        this.translationSelf.y = -this.topOffset - this.dimensions.y / 2;

        this.updateTraslation();
        this._updateDefualtAttachmentPoint();
    }

    private _updateDefualtAttachmentPoint() {
        if (this.children.length === 0 || (this.children.length === 1 && this._ghost)) {
            this.attachmentPoints.clear();
            this.attachmentPoints.push(new ScuffrAttachmentPointScript(this, 0, true, false, { x: this.leftOffset, y: this.topOffset }));
        }
    }

    public toRootScript(): ScuffrElementScriptRoot {
        const rootScript = new ScuffrElementScriptRoot(this.workspace, null, this.children);
        this.workspace.addRenderedScript(rootScript);
        this.children = [];
        this.script.blocks.length = 0;
        this.update(true);
        return rootScript;
    }

    public getBackgroundModifier(): ScuffrShapeModifier {
        return this;
    }

    public getPath(size: Vec2, shape: ScuffrShapeStackBody, line: ScuffrShapeContentLine, ghost: boolean = false): string | null {
        if (
            (ghost && size.y === ScuffrElementScriptInput.MIN_HEIGHT) ||
            (this.children.length !== 0 &&
                (!this._ghost?.wrapping && this.children[this.children.length - 1].shape.shape instanceof ScuffrShapeStackTail) ||
                (this._ghost?.wrapping && this._ghost.wrapping.wrapperBlock.shape.shape instanceof ScuffrShapeStackTail)
            ))
            // end at 12
            // return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
            return `a 4 4 0 0 1 -4 4 ${shape.nub.getLeftPath(12)} a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
            else
            return `a 4 4 0 0 1 -4 4 ${shape.nub.getLeftPath(12)} a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 ${shape.nub.getRightPath()} H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }

    public onAncestryChange(root: ScuffrElementScriptRoot | null): void {
        this._root = root;
        for (const child of this.children) child.onAncestryChange(root);
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }

    public setParent(parentRef: ScuffrBlockReference<BlockPartInput<BlockInput>, ScuffrElementBlockContent>) {
        this._parent = parentRef.parent;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public asInput(): BlockInput {
        return this.script;
    }
}