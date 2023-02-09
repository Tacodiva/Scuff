
export class ScratchBlockCategory {
    public static readonly MOTION = new ScratchBlockCategory("motion");
    public static readonly OPERATORS = new ScratchBlockCategory("operators");
    public static readonly DATA = new ScratchBlockCategory("data");
    public static readonly SOUNDS = new ScratchBlockCategory("sounds");
    public static readonly CONTROL = new ScratchBlockCategory("control");
    public static readonly EVENTS = new ScratchBlockCategory("events");

    public readonly cssClass : string;

    constructor(id: string) {
        this.cssClass = `scuff-block-category-${id}`;
    }
}