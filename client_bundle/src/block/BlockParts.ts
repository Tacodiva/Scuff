import type BlockInstance from "./BlockInstance";
import type { IScuffrBlockPartElement, ScuffrBlockContentElement, ScuffrBlockInstanceElement, SVGBlockRenderContext } from "./svg/SVGBlockRenderer";
import { ScuffrTextElement } from "./svg/SVGTextRenderer";

interface IBlockPart {
    render(block: ScuffrBlockContentElement, ctx: SVGBlockRenderContext): IScuffrBlockPartElement;
}

class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrBlockContentElement, ctx: SVGBlockRenderContext): IScuffrBlockPartElement {
        return new ScuffrTextElement(block, this.text);
    }
}

export type { IBlockPart };
export { BlockPartText };