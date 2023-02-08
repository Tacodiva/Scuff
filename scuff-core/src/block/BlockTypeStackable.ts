import { BlockType, type BlockTypeDescription } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScuffrBackground } from "../scuffr/background/ScuffrBackground";
import { ScuffBackgroundShapes } from "../scuffr/background/ScuffBackgroundShapes";
import type { ScuffrBackgroundShape } from "../scuffr/background/ScuffrBackgroundShape";

export enum StackableBlockShape {
    HEAD,
    BODY,
    TAIL
}

export interface StackableBlockTypeDescription extends BlockTypeDescription {
    shape?: StackableBlockShape;
}

export abstract class BlockTypeStackable extends BlockType {
    private _shape: StackableBlockShape | null;

    constructor(id: string) {
        super(id);
        this._shape = null;
    }

    protected override init(desc: StackableBlockTypeDescription): void {
        this._shape = desc.shape ?? StackableBlockShape.BODY;
        super.init(desc);
    }

    public override canStackDown(block: BlockInstance): boolean {
        return this._shape !== StackableBlockShape.TAIL;
    }

    public override canStackUp(block: BlockInstance): boolean {
        return this._shape !== StackableBlockShape.HEAD;
    }

    public getBackground(block: BlockInstance): ScuffrBackground {
        return new ScuffrBackground(this.getBackgroundShape(block), this.category.cssClass, "scuff-block");
    }

    public getBackgroundShape(block: BlockInstance): ScuffrBackgroundShape {
        switch (this._shape) {
            case StackableBlockShape.BODY:
                return ScuffBackgroundShapes.StackBody;
            case StackableBlockShape.TAIL:
                return ScuffBackgroundShapes.StackTail;
            case StackableBlockShape.HEAD:
                return ScuffBackgroundShapes.StackHead;
        }
        throw new Error();
    }
}