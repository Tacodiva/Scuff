import type { IScuffrBlockPartElement } from "../scuffr/IScuffrBlockPartElement";
import type { ScuffrBlockContentElement } from "../scuffr/ScuffrBlockContentElement";
import { ScuffrTextElement } from "../scuffr/ScuffrTextElement";
import type { IBlockPart } from "./IBlockPart";


export class BlockPartText implements IBlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrBlockContentElement): IScuffrBlockPartElement {
        return new ScuffrTextElement(block, this.text);
    }
}
