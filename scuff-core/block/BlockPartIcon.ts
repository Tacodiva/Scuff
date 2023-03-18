import type { ScuffrSvgBlockContent } from "../scuffr/ScuffrSvgBlockContent";
import type { ScuffrSvgBlockPart } from "../scuffr/ScuffrSvgBlockPart";
import { ScuffrSvgIcon } from "../scuffr/ScuffrSvgIcon";
import type { Vec2 } from "../utils/Vec2";
import type { BlockPart } from "./BlockPart";

export class BlockPartIcon implements BlockPart {

    public readonly id: string;
    public readonly dimensions: Vec2;
    public readonly padding: Vec2;

    public constructor(id: string, dimensions: Vec2, padding: Vec2 = {x: 0, y: 0}) {
        this.id = id;
        this.dimensions = dimensions;
        this.padding = padding;
    }

    public render(block: ScuffrSvgBlockContent): ScuffrSvgBlockPart {
        return new ScuffrSvgIcon(block, this.id, this.dimensions, this.padding);
    }
}
