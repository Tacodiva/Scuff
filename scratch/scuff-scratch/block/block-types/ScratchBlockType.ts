import { ScratchBlockCategory } from "../ScratchBlockCategory";
import { BlockType, BlockTypeData, BlockTypeDescription } from "scuff";


export interface ScratchBlockTypeDescription extends BlockTypeDescription {
    category: ScratchBlockCategory;
}

export interface ScratchBlockTypeData extends BlockTypeData {
    category: ScratchBlockCategory;
}

export abstract class ScratchBlockType extends BlockType {

    public static override parseDescription(desc: ScratchBlockTypeDescription): ScratchBlockTypeData {
        return {
            ...BlockType.parseDescription(desc),
            category: desc.category
        };
    }

    public readonly category: ScratchBlockCategory;

    protected constructor(data: ScratchBlockTypeData) {
        super(data);
        this.category = data.category;
    }
}