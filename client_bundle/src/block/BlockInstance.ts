import type { ScuffrBlockInstanceElement, ScuffrParentRef, SVGBlockRenderContext } from "./svg/SVGBlockRenderer";
import type { IBlockInput } from "./BlockInputType";
import type { BlockInputType } from "./BlockInputType";
import type BlockType from "./BlockType";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrParentElement } from "./svg/ScuffrElement";

class BlockInstance implements IBlockInput {
    public readonly type: BlockType;
    private readonly _inputs: Map<string, IBlockInput>;

    public constructor(type: BlockType) {
        this.type = type;
        this._inputs = new Map();

        for (let input of type.inputs) {
            this._inputs.set(input.id, input.defaultValue);
        }
    }

    public hasAttachmentPoint(): boolean {
        return false;
    }

    public getInput(inputId: string): IBlockInput {
        let input = this._inputs.get(inputId);
        if (!input) throw new Error(`Input ${inputId} not on block.`);
        return input;
    }

    public setInput(input: BlockInputType, value: IBlockInput) {
        if (input.block !== this.type)
            throw new Error(`Input ${input.id} was made for block ${input.block.id}, not ${this.type.id}.`);
        if (!input.canTakeValue(value))
            throw new Error(`Invlaid value for input ${input.id}.`);
        this._inputs.set(input.id, value);
    }

    public resetInput(input: BlockInputType) {
        if (input.block !== this.type)
            throw new Error(`Input ${input.id} was made for block ${input.block.id}, not ${this.type.id}.`);
        this._inputs.set(input.id, input.defaultValue);
    }

    public render(parent : ScuffrBlockInstanceElement | null, parentRef: ScuffrParentRef<unknown>, ctx: SVGBlockRenderContext): ScuffrBlockInstanceElement {
        return this.type.renderer.renderBlock(this, parentRef, ctx);
    }

    // public getChild(key: BlockInputType): BlockInstance {
    //     const input = this.getInput(key.id);
    //     if (!(input instanceof BlockInstance))
    //         throw new Error(`Input ${key.id} is not a block.`);
    //     return input;
    // }

}

export { BlockInstance as default };