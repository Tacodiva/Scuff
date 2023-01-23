import { BlockInputString, type BlockInputType, type IBlockInput } from "../block/BlockInputType";
import { ScruffrBackground } from "./background";
import { ScruffrBackgroundShape } from "./background/ScruffrBackgroundShape";
import { type ScruffrBlockContentElement, ScruffrBackgroundedBlockPartElement, type IScruffrBlockInput } from "./ScruffrBlockInstanceElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import { ScruffrTextElement } from "./ScruffrTextElement";

export class ScruffrLiteralInputElement extends ScruffrBackgroundedBlockPartElement<ScruffrTextElement> implements IScruffrBlockInput {
    private _parent: ScruffrBlockContentElement;
    public override get parent(): ScruffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;
    private _value: string;

    public constructor(parent: ScruffrBlockContentElement, input: BlockInputType, value: string) {
        super(parent.root, parent, new ScruffrBackground(
            ScruffrBackgroundShape.ROUND_BLOCK,
            "var(--scruff-block-input-bg)",
            parent.parent.block.type.category.colorTertiary
        ));
        this._parent = parent;
        this.input = input;
        this._value = value;
        this.content.text = this._value;
    }

    protected createContent(): ScruffrTextElement {
        return new ScruffrTextElement(this, "", "var(--scruff-block-input-font-fill)");
    }

    public setValue(value: string) {
        this.parent.parent.block.setInput(this.input, new BlockInputString(value));
        this._value = value;
        this.content.text = value;
        this.content.update(false);
        this.update(true);
    }

    public override onClick(event: MouseEvent): boolean {
        event.preventDefault();
        this.workspace.editLiteralInput(this);
        return true;
    }

    public asInput(): IBlockInput {
        return new BlockInputString(this._value);
    }

    public setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
