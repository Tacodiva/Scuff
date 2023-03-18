import { ScuffrCmdScriptSelectScriptBlocks } from "./commands/ScuffrCmdScriptSelectScriptInput";
import { BlockScriptInput } from "../block/BlockScriptInput";
import type { BlockInput } from "../block/BlockInput";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";
import { ScuffrAttachmentPointScript } from "./attachment-points/ScuffrAttachmentPointScript";
import type { ScuffrShapeModifier } from "./shape/ScuffrShapeModifier";
import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import type { ScuffrSvgBlockInstance } from "./ScuffrSvgBlockInstance";
import type { ScuffrSvgBlockContent } from "./ScuffrSvgBlockContent";
import { ScuffrSvgScript } from "./ScuffrSvgScript";
import type { ScuffrShapeContentLine } from "./shape/ScuffrShapeContentLine";
import { ScuffrShapeStackBody, ScuffrShapeStackHead, ScuffrShapeStackTail } from "./shape";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";
import type { ScuffrCmdScriptSelect } from "./commands/ScuffrCmdScriptSelect";

export class ScuffrSvgScriptInput extends ScuffrSvgScript<BlockScriptInput> implements ScuffrSvgInput, ScuffrShapeModifier {

    public static readonly MIN_HEIGHT = 32;
    public get isSubscript(): boolean { return true; }

    private _reference: ScuffrReferenceInput;
    public get parent(): ScuffrSvgBlockContent { return this._reference.parent; }

    public constructor(reference: ScuffrReferenceInput, script: BlockScriptInput | null, blocks?: ScuffrSvgBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockScriptInput(ScuffrSvgScript.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(reference.parent.dom, reference.parent.root, reference.parent.workspace, script);
        this._reference = reference;
        this._init(blocks);
    }

    protected override _updateAttachmentPoints(): void {
        super._updateAttachmentPoints();
        this._updateDefualtAttachmentPoint();
    }

    protected override _updateBlocks(): void {
        super._updateBlocks();

        this.dimensions.x = 144;
        if (this.children.length === 0) {
            this.dimensions.y = ScuffrSvgScriptInput.MIN_HEIGHT;
        } else {
            this.dimensions.x = 144;
            this.topLeftOffset.y += 4;
            this.dimensions.y += 8;
        }

        this.translationSelf.x = 8;
        this.translationSelf.y = -this.topOffset - this.dimensions.y / 2;

        this._updateDefualtAttachmentPoint();
    }

    private _updateDefualtAttachmentPoint() {
        if (this.children.length === 0 || (this.children.length === 1 && this._ghost)) {
            this.attachmentPoints.clear();
            this.attachmentPoints.push(new ScuffrAttachmentPointScript(this, 0, true, false, { x: this.leftOffset, y: this.topOffset }));
        }
    }

    public clear() {
        this.children = [];
        this.script.blocks.length = 0;
        this.update(true);
    }

    public getBackgroundModifier(): ScuffrShapeModifier {
        return this;
    }

    public getPath(size: Vec2, shape: ScuffrShapeStackBody, line: ScuffrShapeContentLine, ghost: boolean = false): string | null {
        if (
            (ghost && size.y === ScuffrSvgScriptInput.MIN_HEIGHT) ||
            (this.children.length !== 0 &&
                (!this._ghost?.wrapping && this.children[this.children.length - 1].shape.shape instanceof ScuffrShapeStackTail) ||
                (this._ghost?.wrapping && this._ghost.wrapping.wrappingBlock.shape.shape instanceof ScuffrShapeStackTail)
            ))
            // end at 12
            // return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
            return `a 4 4 0 0 1 -4 4 ${shape.nub.getLeftPath(12)} a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
        else
            return `a 4 4 0 0 1 -4 4 ${shape.nub.getLeftPath(12)} a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 ${shape.nub.getRightPath()} H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null): void {
        this._root = root;
        for (const child of this.children) child.onAncestryChange(root);
        this.attachmentPoints.onAncestryChange(root);
    }

    public setParent(reference: ScuffrReferenceInput) {
        this._reference = reference;
        this.onAncestryChange(reference.parent.getRoot());
    }

    public getReference(): ScuffrReferenceInput {
        return this._reference;
    }

    public asInput(): BlockInput {
        return this.script;
    }
}