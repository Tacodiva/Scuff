import { BlockType, type BlockTypeDescription } from "./BlockType";
import type { BlockInstance } from "./BlockInstance";
import { ScruffrBackground } from "../scruffr/background";
import { BackgroundShapes } from "../scruffr/background/BackgroundShapes";
import type { ScruffrBackgroundShape } from "../scruffr/background/ScruffrBackgroundShape";

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

    public getBackground(block: BlockInstance): ScruffrBackground {
        return new ScruffrBackground(this.getBackgroundShape(block), this.category.colorPrimary, this.category.colorTertiary);
    }

    public getBackgroundShape(block: BlockInstance): ScruffrBackgroundShape {
        switch (this._shape) {
            case StackableBlockShape.BODY:
                return BackgroundShapes.StackBody;
            case StackableBlockShape.TAIL:
                return BackgroundShapes.StackTail;
            case StackableBlockShape.HEAD:
                return BackgroundShapes.StackHead;
        }
        throw new Error();
    }
}