import { BlockType, l10n, ScuffrBlockPalette, ScuffrBlockPaletteCategory } from "scuff";
import { ScratchBlocks } from "./blocks";

export const ScratchPalette = new ScuffrBlockPalette();

function createCategory(id: keyof typeof ScratchBlocks) {
    const category = new ScuffrBlockPaletteCategory(id, l10n.raw(id));

    const blocks = ScratchBlocks[id];
    for (const blockID in blocks) {
        category.addBlock(blocks[blockID as keyof typeof blocks] as BlockType);
    }

    ScratchPalette.addCategory(category);

    return category;
}

export const ScratchPaletteCategories: { [K in keyof typeof ScratchBlocks]: ScuffrBlockPaletteCategory } = {
    motion: createCategory("motion"),
    looks: createCategory("looks"),
    event: createCategory("event"),
    control: createCategory("control"),
    sensing: createCategory("sensing"),
    operator: createCategory("operator"),
}
