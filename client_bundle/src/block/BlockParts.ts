import type BlockInstance from "./BlockInstance";
import type { IScuffrBlockPartElement, ScuffrBlockContentElement, ScuffrBlockInstanceElement } from "./svg/SVGBlockRenderer";
import type { SVGRenderedScript } from "./svg/SVGScriptRenderer";
import { ScuffrTextElement } from "./svg/SVGTextRenderer";

interface IBlockPart {
    render(block: ScuffrBlockContentElement, root: SVGRenderedScript): IScuffrBlockPartElement;
}

class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrBlockContentElement, root: SVGRenderedScript): IScuffrBlockPartElement {
        return new ScuffrTextElement(block, this.text);
    }
}

export type { IBlockPart };
export { BlockPartText };