import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import { BlockInputBooleanBlank } from "../block/BlockInputBooleanBlank";
import { ScuffrBackground } from "./background/ScuffrBackground";
import { BackgroundShapes } from "./background/BackgroundShapes";
import type { IScuffrBlockInput } from "./IScuffrBlockInput";
import { ScuffrBackgroundedBlockPartElement } from "./ScuffrBackgroundedBlockPartElement";
import type { ScuffrBlockContentElement } from "./ScuffrBlockContentElement";
import type { ScuffrBlockRef } from "./ScuffrBlockRef";
import { ScuffrDummyElement } from "./ScuffrDummyElement";

export class ScuffrBlankInputElement extends ScuffrBackgroundedBlockPartElement<ScuffrDummyElement> implements IScuffrBlockInput {
    private _parent: ScuffrBlockContentElement;
    public override get parent(): ScuffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;

    public constructor(parent: ScuffrBlockContentElement, input: BlockInputType) {
        super(parent.root, parent, new ScuffrBackground(
            BackgroundShapes.InputTriangle,
            null,
            "scuff-block-empty-boolean"
        ));
        this._parent = parent;
        this.input = input;
    }

    protected createContent(): ScuffrDummyElement {
        return new ScuffrDummyElement(this);
    }

    public asInput(): IBlockInput {
        return BlockInputBooleanBlank.INSTANCE;
    }

    public setParent(parentRef: ScuffrBlockRef<BlockInputType<IBlockInput>, ScuffrBlockContentElement>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
