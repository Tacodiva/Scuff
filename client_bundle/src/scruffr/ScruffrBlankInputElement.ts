import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import { BlockInputBooleanBlank } from "../block/BlockInputBooleanBlank";
import { ScruffrBackground } from "./background/ScruffrBackground";
import { BackgroundShapes } from "./background/BackgroundShapes";
import type { IScruffrBlockInput } from "./IScruffrBlockInput";
import { ScruffrBackgroundedBlockPartElement } from "./ScruffrBackgroundedBlockPartElement";
import type { ScruffrBlockContentElement } from "./ScruffrBlockContentElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import { ScruffrDummyElement } from "./ScruffrDummyElement";

export class ScruffrBlankInputElement extends ScruffrBackgroundedBlockPartElement<ScruffrDummyElement> implements IScruffrBlockInput {
    private _parent: ScruffrBlockContentElement;
    public override get parent(): ScruffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;

    public constructor(parent: ScruffrBlockContentElement, input: BlockInputType) {
        super(parent.root, parent, new ScruffrBackground(
            BackgroundShapes.InputTriangle,
            null,
            "scruff-block-empty-boolean"
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
