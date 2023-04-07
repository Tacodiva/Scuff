import type { Vec2 } from "../utils/Vec2";
import { ScuffContextMenu, type ScuffrCtxMenuItem } from "./ScuffContextMenu";
import { ScuffEditorInteraction } from "./ScuffEditorInteraction";
import type { ScuffEditor } from "./ScuffEditor";

export class ScuffEditorInteractionCtxMenu extends ScuffEditorInteraction {

    public readonly menu: ScuffContextMenu;

    public constructor(editor: ScuffEditor, pos: Vec2, items: ScuffrCtxMenuItem[], classes: string[]) {
        super(editor);
        this.menu = new ScuffContextMenu(pos, items, classes, "corner");
        this.menu.onAction = this._menuOnAction;
    }

    private readonly _menuOnAction = (item: ScuffrCtxMenuItem) => {
        this.end();
    };

    public override onEnd(): void {
        this.menu.close();
    }

    public override onMouseWheel(event: MouseEvent): void {
        if (!this.menu.svg.contains(event.target as Node))
            this.end();
    }

    public override onMouseDown(event: MouseEvent): void {
        event.preventDefault();
    }

    public override onMouseUp(event: MouseEvent): void {
        if (!this.menu.container.contains(event.target as Node))
            this.end();
    }

    public override onMouseMove(event: MouseEvent): void {
        if (!this.menu.container.contains(event.target as Node) && (event.buttons & 1) !== 0)
            this.end();
        this.menu.onMouseMove(event);
    }
}
