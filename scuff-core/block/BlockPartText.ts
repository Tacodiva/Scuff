import type { ScuffrSvgBlockContent } from "../scuffr/ScuffrSvgBlockContent";
import type { ScuffrSvgBlockPart } from "../scuffr/ScuffrSvgBlockPart";
import { ScuffrSvgText } from "../scuffr/ScuffrSvgText";
import type { BlockPart } from "./BlockPart";

export class BlockPartText implements BlockPart {

    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public render(block: ScuffrSvgBlockContent): ScuffrSvgBlockPart {
        return new ScuffrSvgText(block, this.text);
    }
}
