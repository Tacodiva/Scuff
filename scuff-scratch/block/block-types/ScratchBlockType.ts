import { ScratchBlockCategory } from "../ScratchBlockCategory";
import { BlockType, BlockTypeDescription } from "scuff";


export interface ScratchBlockTypeDescriptor extends BlockTypeDescription {
    category: ScratchBlockCategory;
}

export abstract class ScratchBlockType extends BlockType {
    private _category: ScratchBlockCategory | null;

    constructor(id: string) {
        super(id);
        this._category = null;
    }

    protected override init(desc: ScratchBlockTypeDescriptor): void {
        super.init(desc);
        this._category = desc.category;
    }

    public get category() {
        this.checkInited();
        return this._category!;
    }
}