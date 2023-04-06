import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeStackBody, ScuffrShapeStackHead, ScuffrShapeStackTail } from "scuff";
import { ScratchBlockType, ScratchBlockTypeData, ScratchBlockTypeDescription } from "./ScratchBlockType";

export enum ScratchStackableBlockShape {
    HEAD,
    BODY,
    TAIL
}

export interface ScratchBlockTypeDescriptionStackable extends ScratchBlockTypeDescription {
    shape?: ScratchStackableBlockShape;
}

export interface ScratchBlockTypeDataStackable extends ScratchBlockTypeData {
    shape: ScratchStackableBlockShape;
}

export abstract class ScratchBlockTypeStackable extends ScratchBlockType {

    public static readonly shapeHead: ScuffrShape = new ScuffrShapeStackHead();
    public static readonly shapeBody: ScuffrShape = new ScuffrShapeStackBody();
    public static readonly shapeTail: ScuffrShape = new ScuffrShapeStackTail();

    public static override parseDescription(desc: ScratchBlockTypeDescriptionStackable): ScratchBlockTypeDataStackable {
        return {
            ...ScratchBlockType.parseDescription(desc),
            shape: desc.shape ?? ScratchStackableBlockShape.BODY
        };
    }


    private shape: ScratchStackableBlockShape | null;

    constructor(data: ScratchBlockTypeDataStackable) {
        super(data);
        this.shape = data.shape;
    }

    public override canStackDown(block: BlockInstance): boolean {
        return this.shape !== ScratchStackableBlockShape.TAIL;
    }

    public override canStackUp(block: BlockInstance): boolean {
        return this.shape !== ScratchStackableBlockShape.HEAD;
    }

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: this.getBackgroundShape(block),
            categoryClasses: [this.category.cssClass],
            typeClasses: ["scuff-block"]
        };
    }

    public getBackgroundShape(block: BlockInstance): ScuffrShape {
        switch (this.shape) {
            case ScratchStackableBlockShape.HEAD:
                return ScratchBlockTypeStackable.shapeHead;
            case ScratchStackableBlockShape.BODY:
                return ScratchBlockTypeStackable.shapeBody;
            case ScratchStackableBlockShape.TAIL:
                return ScratchBlockTypeStackable.shapeTail;
        }
        throw new Error();
    }
}