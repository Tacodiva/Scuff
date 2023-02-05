import type { IScruffrBlockPartElement } from "../scruffr/IScruffrBlockPartElement";
import type { ScruffrBlockContentElement } from "../scruffr/ScruffrBlockContentElement";
import { ScruffrTextElement } from "../scruffr/ScruffrTextElement";
import type { IBlockPart } from "./IBlockPart";


export class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScruffrBlockContentElement): IScruffrBlockPartElement {
        return new ScruffrTextElement(block, this.text);
    }
}
