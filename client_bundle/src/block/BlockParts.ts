import type { IScuffrBlockPartElement, ScuffrBlockContentElement, ScuffrBlockInstanceElement } from "../scuffr/ScuffrBlockInstanceElement";
import type { ScuffrRootScriptElement } from "../scuffr/ScuffrScriptElement";
import { ScuffrTextElement } from "../scuffr/ScuffrTextElement";

export interface IBlockPart {
    render(block: ScuffrBlockContentElement): IScuffrBlockPartElement;
}

export class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrBlockContentElement): IScuffrBlockPartElement {
        return new ScuffrTextElement(block, this.text);
    }
}
