import type { Vec2 } from "../utils/Vec2"
import type { BlockScript } from "./BlockScript";
import type { ScuffrElement } from "../scuffr/ScuffrElement";

interface IBlockAttachmentPointType {
    canTakeScript(script: BlockScript): boolean;
}

class BlockAttachmentPoint {
    public readonly translation: Vec2;
    public readonly type: IBlockAttachmentPointType;
    public readonly parent: ScuffrElement;

    public constructor(parent: ScuffrElement, type: IBlockAttachmentPointType, translation: Vec2 = { x: 0, y: 0 }) {
        this.type = type;
        this.translation = translation;
        this.parent = parent;
    }

    public getAbsoluteTranslation(): Vec2 {
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

    public canTakeScript(script: BlockScript): boolean {
        if (this.requireStackDown) {
            const lastBlock = script.blocks[script.blocks.length - 1];
            if (!lastBlock.type.canStackDown(lastBlock))
                return false;
        }
        if (this.requireStackUp) {
            const firstBlock = script.blocks[0];
            if (!firstBlock.type.canStackUp(firstBlock))
                return false;
        }
        return true;
    }
}

export { BlockStackAttachmentPointType, BlockAttachmentPoint };
export type { IBlockAttachmentPointType };