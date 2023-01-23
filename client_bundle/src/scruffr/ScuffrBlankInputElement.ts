import { BlockInputBooleanBlank, type BlockInputType, type IBlockInput } from "../block/BlockInputType";
import { ScruffrBackground } from "./background";
import { ScruffrBackgroundShape } from "./background/ScruffrBackgroundShape";
import { type ScruffrBlockContentElement, ScruffrBackgroundedBlockPartElement, type IScruffrBlockInput } from "./ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import { ScruffrDummyElement } from "./ScruffrElement";

export class ScruffrBlankInputElement extends ScruffrBackgroundedBlockPartElement<ScruffrDummyElement> implements IScruffrBlockInput {
    private _parent: ScruffrBlockContentElement;
    public override get parent(): ScruffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;

    public constructor(parent: ScruffrBlockContentElement, input: BlockInputType) {
        super(parent.root, parent, new ScruffrBackground(
            ScruffrBackgroundShape.TRIANGLE_BLOCK,
            parent.parent.block.type.category.colorTertiary,
            parent.parent.block.type.category.colorTertiary
        ));
        this._parent = parent;
        this.input = input;
    }

    protected createContent(): ScruffrDummyElement {
        return new ScruffrDummyElement(this);
    }

    public asInput(): IBlockInput {
        return BlockInputBooleanBlank.INSTANCE;
    }

    public setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
