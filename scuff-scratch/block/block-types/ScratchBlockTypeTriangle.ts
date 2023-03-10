import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeInputTriangle } from "scuff";
import { ScratchBlockTypeInput } from "./ScratchBlockTypeInput";

export abstract class ScratchBlockTypeTriangle extends ScratchBlockTypeInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputTriangle();

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: ScratchBlockTypeTriangle.shape,
            categoryClasses: [this.category.cssClass],
            typeClasses: ["scuff-block"]
        };
    }
}
