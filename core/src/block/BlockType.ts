import type { BlockPart } from "./BlockPart";
import type { BlockPartInput } from "./BlockPartInput";
import { BlockInstance } from "./BlockInstance";
import { BlockPartText } from "./BlockPartText";
import type { l10nString } from "../l10n";
import type { ScuffrColouredShape } from "../scuffr/shape/ScuffrColouredShape";

export type BlockPartInputFactory = (type: BlockType, id: number) => BlockPartInput;
export type BlockPartFactory = (type: BlockType) => BlockPart;

export interface BlockTypeDescription {
    id: string;
    text: l10nString;
    inputs?: BlockPartInputFactory[];
    decoration?: BlockPartFactory[];
}

export interface BlockTypeData {
    readonly id: string;
    readonly parts: (number | BlockPartFactory)[];
    readonly inputs: BlockPartInputFactory[];
}

export abstract class BlockType {

    public static parseDescription(desc: BlockTypeDescription): BlockTypeData {
        let parts: (number | BlockPartFactory)[] = [];

        let decorationIdx = 0;
        let inputIdx = 0;

        const text = desc.text.str;
        let lastI = 0;

        const pushText = (i: number) => {
            const partText = text.substring(lastI, i).trim();
            lastI = i + 1;
            if (partText.length !== 0)
                parts.push(() => new BlockPartText(partText));
        };

        for (let i = 0; i < text.length; i++) {
            switch (text[i]) {
                case '\\':
                    ++i;
                    break;
                case '%': {
                    pushText(i);
                    if (!desc.inputs) throw new Error("Expected inputs in block type description.");
                    parts.push(inputIdx++);
                    if (inputIdx > desc.inputs.length) throw new Error("Not enough inputs provided.")
                    break;
                }
                case '$': {
                    pushText(i);
                    if (!desc.decoration) throw new Error("Expected decorations in block type description.");
                    const decor = desc.decoration[decorationIdx++];
                    if (!decor) throw new Error("Not enough decorations provided.");
                    parts.push(decor);
                }
            }
        }

        pushText(text.length);

        if (inputIdx !== (desc.inputs?.length ?? 0))
            throw new Error(`Too many inputs provided. Expected ${inputIdx} but found ${desc.inputs?.length ?? 0}`);

        if (decorationIdx !== (desc.decoration?.length ?? 0))
            throw new Error(`Too many decorations provided. Expected ${decorationIdx} but found ${desc.decoration?.length ?? 0}`);

        return {
            id: desc.id,
            inputs: desc.inputs ?? [],
            parts: parts
        };
    }

    public readonly id: string;

    public readonly inputs: readonly BlockPartInput[];
    public readonly parts: readonly BlockPart[];

    private readonly _inputNameMap: ReadonlyMap<string, BlockPartInput>;

    public constructor(data: BlockTypeData) {
        this.id = data.id;

        let inputs = [];
        let inputNameMap = new Map();

        for (let i = 0; i < data.inputs.length; i++) {
            const input = inputs[i] = data.inputs[i](this, i);
            inputNameMap.set(input.name, input);
        }

        let parts = [];
        for (const part of data.parts) {
            if (typeof part === "number") {
                parts.push(inputs[part]);
            } else {
                parts.push(part(this));
            }
        }

        this.inputs = inputs;
        this.parts = parts;
        this._inputNameMap = inputNameMap;
    }

    public createInstance(inputs?: any): BlockInstance {
        let instance = new BlockInstance(this);
        if (!inputs) return instance;
        for (var key in inputs) {
            const input = this._inputNameMap?.get(key);
            if (!input)
                throw new Error(`No such input ${key} on block ${this.id}.`);
            const value = inputs[key];
            if (value !== undefined)
                instance.setInput(input, value);
        }
        return instance;
    }

    public canStackDown(block: BlockInstance): boolean {
        return false;
    }

    public canStackUp(block: BlockInstance): boolean {
        return false;
    }

    public getInput(name: string): BlockPartInput | null {
        return this._inputNameMap.get(name) ?? null;
    }

    public abstract getBackground(block: BlockInstance): ScuffrColouredShape;

}
