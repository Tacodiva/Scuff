import { BlockType, l10n, ScuffrBlockPaletteCategory } from "scuff";
import { ScratchBlocks } from "../blocks";

export class ScratchBlockCategory<K extends keyof typeof ScratchBlocks = keyof typeof ScratchBlocks> {
    public readonly cssClass: string;
    public readonly id: K;

    constructor(id: K) {
        this.id = id;
        this.cssClass = `scuff-block-category-${id}`;
    }
}

export const ScratchCategories: { [K in keyof typeof ScratchBlocks]: ScratchBlockCategory } = {
    motion: new ScratchBlockCategory("motion"),
    looks: new ScratchBlockCategory("looks"),
    event: new ScratchBlockCategory("event"),
    control: new ScratchBlockCategory("control"),
    sensing: new ScratchBlockCategory("sensing"),
    operator: new ScratchBlockCategory("operator")
}