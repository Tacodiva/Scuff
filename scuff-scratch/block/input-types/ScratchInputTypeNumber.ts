import { ScratchInputString } from "../inputs/ScratchInputString";
import { BlockPartInput, BlockType, BlockInput, BlockInstance, BlockPartInputFactory } from "scuff";
import { ScratchBlockTypeInput } from "../block-types/ScratchBlockTypeInput";

export class ScratchInputTypeNumber extends BlockPartInput<ScratchInputString | BlockInstance> {

    public static isValidNumber(value: string) {
        return (
            (!isNaN(value as any) && !isNaN(parseFloat(value))) ||
            value.trim().length === 0
        );
    }

    public static create(name: string, defaultValue?: number): BlockPartInputFactory {
        return (type, id) => new ScratchInputTypeNumber(id, name, type, defaultValue);
    }

    public constructor(id: number, name: string, block: BlockType, defaultValue?: number) {
        super(id, name, block, () => new ScratchInputString("" + (defaultValue ?? "")));
    }

    public isValidValue(block: BlockInstance, value: BlockInput): ScratchInputString | BlockInstance | false {
        if (value instanceof ScratchInputString) {
            return ScratchInputTypeNumber.isValidNumber(value.value) ? value : false;
        }
        if (value instanceof BlockInstance)
            return value.type instanceof ScratchBlockTypeInput ? value : false;
        return false;
    }
}
