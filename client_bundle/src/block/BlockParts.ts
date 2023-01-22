import type { IScruffrBlockPartElement, ScruffrBlockContentElement, ScruffrBlockInstanceElement } from "../scruffr/ScruffrBlockInstanceElement";
import type { ScruffrRootScriptElement } from "../scruffr/ScruffrScriptElement";
import { ScruffrTextElement } from "../scruffr/ScruffrTextElement";

export interface IBlockPart {
    render(block: ScruffrBlockContentElement): IScruffrBlockPartElement;
}

export class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScruffrBlockContentElement): IScruffrBlockPartElement {
        return new ScruffrTextElement(block, this.text);
    }
}
