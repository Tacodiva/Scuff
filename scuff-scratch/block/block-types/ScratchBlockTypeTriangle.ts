import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeInputTriangle } from "scuff";
import { ScratchBlockType } from "./ScratchBlockType";
import { ScratchBlockTypeRound } from "./ScratchBlockTypeRound";

export abstract class ScratchBlockTypeTriangle extends ScratchBlockType {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputTriangle();

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: ScratchBlockTypeTriangle.shape,
            categoryClass: this.category.cssClass,
            typeClass: "scuff-block"
        };
    }
}
