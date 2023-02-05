import type { BlockInputType } from "../block/BlockInputType";
import { BlockSubscriptInput } from "../block/BlockSubscriptInput";
import type { IBlockInput } from "../block/IBlockInput";
import type { Vec2 } from "../utils/Vec2";
import { ScruffrScriptAttachmentPoint } from "./attachment_points/ScruffrScriptAttachmentPoint";
import type { IScruffrBackgroundModifier, ScruffrBackgroundContentLine } from "./background/ScruffrBackground";
import { BackgroundShapes } from "./background/BackgroundShapes";
import type { IScruffrBlock } from "./IScruffrBlock";
import type { IScruffrBlockInput } from "./IScruffrBlockInput";
import type { ScruffrBlockContentElement } from "./ScruffrBlockContentElement";
import type { ScruffrBlockInstanceElement } from "./ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import { ScruffrRootScriptElement } from "./ScruffrRootScriptElement";
import { ScruffrScriptElement } from "./ScruffrScriptElement";

export class ScruffrInputSubscriptElement extends ScruffrScriptElement<BlockSubscriptInput> implements IScruffrBlockInput, IScruffrBackgroundModifier {
    private _parent: ScruffrBlockContentElement;
    public get parent(): ScruffrBlockContentElement { return this._parent; }


    public constructor(parent: ScruffrBlockInstanceElement, script: BlockSubscriptInput | null, blocks?: IScruffrBlock[]) {
        if (!script) {
            if (!blocks) throw new Error("Must provide either script or blocks but both where undefined.");
            script = new BlockSubscriptInput(ScruffrScriptElement.getBlockInstanceElements(blocks).flatMap(inst => inst.block));
        }
        super(parent.content.dom, parent.root, parent.workspace, script, blocks);
        this._parent = parent.content;
    }

    public override update(propagateUp: boolean): void {
        super.update(false);
        if (this.children.length === 0) {
            this.dimensions.x = 144;
            this.dimensions.y = 32;
            this.translationSelf.x = 0;
            this.translationSelf.y = 0;
            this.attachmentPoints.push(new ScruffrScriptAttachmentPoint(this, 0, true, false, { x: 8, y: -12 }))
        } else {
            this.translationSelf.x = 8;
            this.translationSelf.y = -this.topOffset - this.dimensions.y / 2;
            this.dimensions.x = 144;
            this.dimensions.y += 8;
            this.updateTraslation();
        }

        if (propagateUp && this.parent) this.parent.update(true);
    }

    public toRootScript(): ScruffrRootScriptElement {
        const rootScript = new ScruffrRootScriptElement(this.workspace, null, this.children);
        this.workspace.addRenderedScript(rootScript);
        this.children = [];
        this.script.blocks.length = 0;
        this.update(true);
        return rootScript;
    }

    public getBackgroundModifier(): IScruffrBackgroundModifier {
        return this;
    }

    public getPath(size: Vec2, line: ScruffrBackgroundContentLine): string | null {
        if (this.children.length !== 0 && this.children[this.children.length - 1].background.shape === BackgroundShapes.StackTail)
            return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
        else
            return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v ${line.dimensions.y - 16} a 4 4 0 0 0 4 4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }

    public onAncestryChange(root: ScruffrRootScriptElement | null): void {
        this._root = root;
        for (const child of this.children) child.onAncestryChange(root);
        this.attachmentPoints.onAncestryChange(root);
    }

    public override onTranslationUpdate(): void {
        this.attachmentPoints.recalculateTranslation();
        super.onTranslationUpdate();
    }

    public setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>) {
        this._parent = parentRef.parent;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public asInput(): IBlockInput {
        return this.script;
    }
}