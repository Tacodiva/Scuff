import { BlockType, type BlockTypeDescription } from "./BlockType";
import { ScuffrBackground, ScuffrBackgroundShape } from "../scuffr/ScuffrBackground";
import type { BlockInstance } from "./BlockInstance";

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
        return new ScuffrBackground(this.getBackgroundShape(block), this.category.colorPrimary, this.category.colorTertiary);
    }

    public getBackgroundShape(block: BlockInstance): ScuffrBackgroundShape {
        return ScuffrBackgroundShape.STACK_BODY;
    }
}