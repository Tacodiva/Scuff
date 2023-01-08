
export class BlockCategory {

    public static readonly MOTION = new BlockCategory("motion");
    public static readonly OPERATORS = new BlockCategory("operators");
    public static readonly DATA = new BlockCategory("data");
    public static readonly SOUNDS = new BlockCategory("sounds");

    public readonly colorPrimary;
    public readonly colorSecondary;
    public readonly colorTertiary;

    constructor(id: string) {
        this.colorPrimary = `var(--scuff-block-${id}-bg-primary)`;
        this.colorSecondary = `var(--scuff-block-${id}-bg-secondary)`;
        this.colorTertiary = `var(--scuff-block-${id}-bg-tertiary)`;
    }
}