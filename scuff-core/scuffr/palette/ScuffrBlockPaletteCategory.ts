import type { BlockType } from "../../block/BlockType";
import type { l10nString } from "../../l10n";
import type { ScuffrBlockPaletteItem } from "./ScuffrBlockPaletteItem";
import { ScuffrBlockPaletteItemBlock } from "./ScuffrBlockPaletteItemBlock";
import { ScuffrBlockPaletteItemText } from "./ScuffrBlockPaletteItemText";

export class ScuffrBlockPaletteCategory {
    public readonly id: string;
    public readonly name: l10nString;

    private _items: ScuffrBlockPaletteItem[];

    public constructor(id: string, name: l10nString) {
        this.id = id;
        this.name = name;
        this._items = [];
        this._items.push(new ScuffrBlockPaletteItemText(name));
    }

    public addBlock(...blocks: BlockType[]): this {
        for (const block of blocks)
            this._items.push(new ScuffrBlockPaletteItemBlock(block));
        return this;
    }

    public addItem(...items: ScuffrBlockPaletteItem[]) {
        for (const item of items)
            this._items.push(item);
        return this;
    }

    public getItems() : Iterable<ScuffrBlockPaletteItem> {
        return this._items;
    }
}
