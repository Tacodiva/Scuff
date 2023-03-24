import type { l10nString } from "../../l10n";
import { ScuffrBlockPaletteCategory } from "./ScuffrBlockPaletteCategory";

export class ScuffrBlockPalette {

    private _categories: Map<string, ScuffrBlockPaletteCategory>

    public constructor() {
        this._categories = new Map();
    }

    public getCategory(id: string) : ScuffrBlockPaletteCategory | null {
        return this._categories.get(id) ?? null;
    }

    public createCategory(id: string, name: l10nString): ScuffrBlockPaletteCategory {
        const category = new ScuffrBlockPaletteCategory(id, name);
        this._categories.set(id, category);
        return category;
    }

    public addCategory(category: ScuffrBlockPaletteCategory) {
        this._categories.set(category.id, category);
    }

    public getCategories() : Iterable<ScuffrBlockPaletteCategory> {
        return this._categories.values();
    }
}

