import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeInputRound } from "scuff";
import { ScratchBlockType } from "./ScratchBlockType";

export abstract class ScratchBlockTypeRound extends ScratchBlockType {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: ScratchBlockTypeRound.shape,
            categoryClass: this.category.cssClass,
            typeClass: "scuff-block"
        };
    }
}
