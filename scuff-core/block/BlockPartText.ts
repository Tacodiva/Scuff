import type { ScuffrElementBlockContent } from "../scuffr/ScuffrElementBlockContent";
import type { ScuffrElementBlockPart } from "../scuffr/ScuffrElementBlockPart";
import { ScuffrElementText } from "../scuffr/ScuffrElementText";
import type { BlockPart } from "./BlockPart";

export class BlockPartText implements BlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrElementBlockContent): ScuffrElementBlockPart {
        return new ScuffrElementText(block, this.text);
    }
}
