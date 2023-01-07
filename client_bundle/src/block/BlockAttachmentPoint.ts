import type { Vec2 } from "../utils/Vec2"
import type BlockInstance from "./BlockInstance";
import type { ScuffrElement, ScuffrElementImpl } from "./svg/ScuffrElement";
import type { ScuffrBlockInstanceElement } from "./svg/SVGBlockRenderer";

interface IBlockAttachmentPointType {
    canTakeValue(value: BlockInstance): boolean;
}

class BlockAttachmentPoint {
    public readonly translation: Vec2;
    public readonly type: IBlockAttachmentPointType;
    public readonly parent : ScuffrElement;

    public constructor(parent : ScuffrElement, type: IBlockAttachmentPointType, translation : Vec2 = {x: 0, y: 0}) {
        this.type = type;
        this.translation = translation;
        this.parent = parent;
    }

    public getAbsoluteTranslation() : Vec2 {
        const parentPos = this.parent.getAbsoluteTranslation();
        return {
            x: this.translation.x + parentPos.x,
            y: this.translation.y + parentPos.y
        }
    }
}

class BlockStackAttachmentPointType implements IBlockAttachmentPointType {
    public readonly requireStackUp: boolean;
    public readonly requireStackDown: boolean;

    public constructor(requireAttachUp: boolean, requireAttachDown: boolean) {
        this.requireStackUp = requireAttachUp;
        this.requireStackDown = requireAttachDown;
    }

    public canTakeValue(value: BlockInstance): boolean {
        if (this.requireStackDown) {
            if (!value.type.canStackDown(value))
                return false;
        }
        if (this.requireStackUp) {
            if (!value.type.canStackUp(value))
                return false;
        }
        return true;
    }
}

export { BlockStackAttachmentPointType, BlockAttachmentPoint };
export type { IBlockAttachmentPointType };