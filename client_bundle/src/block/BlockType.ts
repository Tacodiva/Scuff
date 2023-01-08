import type { IBlockPart } from "./BlockParts";
import type { BlockInputType } from "./BlockInputType";
import { BlockPartText } from "./BlockParts";
import { BlockInstance } from "./BlockInstance";
import type l10nString from "../l10n";
import type { ScuffrBackground } from "../scuffr/ScuffrBackground";
import type { BlockCategory } from "./BlockCategory";

export interface BlockTypeDescription {
    text: l10nString;
    inputs?: BlockInputType[];
    category: BlockCategory;
}

export abstract class BlockType {

    public readonly id: string;

    private _category: BlockCategory | null;

    private _inputs: Map<string, BlockInputType> | null;
    private _parts: IBlockPart[] | null;

    constructor(id: string) {
        this.id = id;
        this._inputs = null;
        this._parts = null;
        this._category = null;
    }

    protected init(desc: BlockTypeDescription) {
        this._inputs = new Map();
        this._parts = [];
        this._category = desc.category;

        const text = desc.text.str;
        let lastI = 0;
        for (let i = 0; i < text.length; i++) {
            switch (text[i]) {
                case '\\':
                    ++i;
                    break;
                case '%':
                    const partText = text.substring(lastI, i).trim();
                    lastI = i + 1;
                    if (partText.length !== 0)
                        this._parts.push(new BlockPartText(partText));
                    if (!desc.inputs) throw new Error("Expected inputs in block type description.");
                    const input = desc.inputs[this._inputs.size];
                    if (!input) throw new Error("Not enough inputs provided.")
                    this._inputs.set(input.id, input);
                    this._parts.push(input);
                    break;
            }
        }

        const partText = text.substring(lastI, text.length).trim();
        if (partText.length !== 0)
            this._parts.push(new BlockPartText(partText));

        if (this._inputs.size !== (desc.inputs?.length ?? 0))
            throw new Error(`Too many inputs provided. Expected ${this._inputs.size} but found ${desc.inputs?.length ?? 0}`);
    }

    public checkInited() {
        if (this._inputs === null)
            throw new Error(`Implimentations of BlockType must call init from their construtor.`);
    }

    public get inputs(): IterableIterator<BlockInputType> {
        this.checkInited();
        return this._inputs!.values();
    }

    public get parts(): IBlockPart[] {
        this.checkInited();
        return this._parts!;
    }

    public get category(): BlockCategory {
        this.checkInited();
        return this._category!;
    }

    public createInstance(inputs?: any): BlockInstance {
        let instance = new BlockInstance(this);
        if (!inputs) return instance;
        for (var key in inputs) {
            let input = this._inputs?.get(key);
            if (!input)
                throw new Error(`No such input ${input} on block ${this.id}.`);
            instance.setInput(input, inputs[key]);
        }
        return instance;
    }

    public canStackDown(block: BlockInstance): boolean {
        return false;
    }

    public canStackUp(block: BlockInstance): boolean {
        return false;
    }

    public abstract getBackground(block: BlockInstance): ScuffrBackground;

}
