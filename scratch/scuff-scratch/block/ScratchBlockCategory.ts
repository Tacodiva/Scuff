
export class ScratchBlockCategory {
    public readonly cssClass: string;
    public readonly id: string;

    constructor(id: string) {
        this.id = id;
        this.cssClass = `scuff-block-category-${id}`;
    }
}

export const ScratchCategories = {
    motion: new ScratchBlockCategory("motion"),
    looks: new ScratchBlockCategory("looks"),
    event: new ScratchBlockCategory("event"),
    control: new ScratchBlockCategory("control"),
    sensing: new ScratchBlockCategory("sensing"),
    operator: new ScratchBlockCategory("operator"),
    variable: new ScratchBlockCategory("data")
};