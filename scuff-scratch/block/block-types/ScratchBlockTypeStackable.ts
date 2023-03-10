import { BlockInstance, ScuffrColouredShape, ScuffrShape, ScuffrShapeStackBody, ScuffrShapeStackHead, ScuffrShapeStackTail } from "scuff";
import { ScratchBlockType, ScratchBlockTypeDescriptor as ScratchBlockDescriptor } from "./ScratchBlockType";

export enum ScratchStackableBlockShape {
    HEAD,
    BODY,
    TAIL
}

export interface ScratchStackableBlockDescriptor extends ScratchBlockDescriptor {
    shape?: ScratchStackableBlockShape;
}

export abstract class ScratchBlockTypeStackable extends ScratchBlockType {

    public static readonly shapeHead: ScuffrShape = new ScuffrShapeStackHead();
    public static readonly shapeBody: ScuffrShape = new ScuffrShapeStackBody();
    public static readonly shapeTail: ScuffrShape = new ScuffrShapeStackTail();

    private _shape: ScratchStackableBlockShape | null;

    constructor(id: string) {
        super(id);
        this._shape = null;
    }

    protected override init(desc: ScratchStackableBlockDescriptor): void {
        super.init(desc);
        this._shape = desc.shape ?? ScratchStackableBlockShape.BODY;
    }

    public override canStackDown(block: BlockInstance): boolean {
        return this._shape !== ScratchStackableBlockShape.TAIL;
    }

    public override canStackUp(block: BlockInstance): boolean {
        return this._shape !== ScratchStackableBlockShape.HEAD;
    }

    public getBackground(block: BlockInstance): ScuffrColouredShape {
        return {
            shape: this.getBackgroundShape(block),
            categoryClasses: [this.category.cssClass],
            typeClasses: ["scuff-block"]
        };
    }

    public getBackgroundShape(block: BlockInstance): ScuffrShape {
        switch (this._shape) {
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