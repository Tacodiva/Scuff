import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeInputRound } from "scuff";
import { ScratchBlockTypeInput } from "./ScratchBlockTypeInput";

export abstract class ScratchBlockTypeRound extends ScratchBlockTypeInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: ScratchBlockTypeRound.shape,
            categoryClasses: [this.category.cssClass],
            typeClasses: ["scuff-block"]
        };
    }
}
