import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeInputRound, ScuffrShapeInputSquare } from "scuff";
import { ScratchBlockTypeInput } from "./ScratchBlockTypeInput";

export abstract class ScratchBlockTypeRound extends ScratchBlockTypeInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();
    // public static readonly shape: ScuffrShape = new ScuffrShapeInputSquare();

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: ScratchBlockTypeRound.shape,
            categoryClass: this.category.cssClass,
            typeClass: "scuff-block"
        };
    }
}
