
export class BlockCategory {

    public static readonly MOTION = new BlockCategory("motion");
    public static readonly OPERATORS = new BlockCategory("operators");
    public static readonly DATA = new BlockCategory("data");
    public static readonly SOUNDS = new BlockCategory("sounds");
    public static readonly CONTROL = new BlockCategory("control");
    public static readonly EVENTS = new BlockCategory("events");

    public readonly cssClass : string;

    constructor(id: string) {
        this.cssClass = `scruff-block-category-${id}`;
    }
}