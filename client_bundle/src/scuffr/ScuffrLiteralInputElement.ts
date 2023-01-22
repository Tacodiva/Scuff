import { BlockInputString, type BlockInputType, type IBlockInput } from "../block/BlockInputType";
import { ScuffrBackground, ScuffrBackgroundShape, type IScuffrBackgroundModifier } from "./ScuffrBackground";
import { type ScuffrBlockContentElement, ScuffrBackgroundedBlockPartElement, type IScuffrBlockInput } from "./ScuffrBlockInstanceElement";
import type { ScuffrBlockRef } from "./ScuffrBlockRef";
import { ScuffrTextElement } from "./ScuffrTextElement";

export class ScuffrLiteralInputElement extends ScuffrBackgroundedBlockPartElement<ScuffrTextElement> implements IScuffrBlockInput {
    private _parent: ScuffrBlockContentElement;
    public override get parent(): ScuffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;
    private _value: string;

    public constructor(parent: ScuffrBlockContentElement, input: BlockInputType, value: string) {
        super(parent.root, parent, new ScuffrBackground(
            ScuffrBackgroundShape.ROUND_BLOCK,
            "var(--scuff-block-input-bg)",
            parent.parent.block.type.category.colorTertiary
        ));
        this._parent = parent;
        this.input = input;
        this._value = value;
        this.content.text = this._value;
    }

    protected createContent(): ScuffrTextElement {
        return new ScuffrTextElement(this, "", "var(--scuff-block-input-font-fill)");
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

    public setParent(parentRef: ScuffrBlockRef<BlockInputType<IBlockInput>, ScuffrBlockContentElement>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
