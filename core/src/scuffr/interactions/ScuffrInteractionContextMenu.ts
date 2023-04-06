import type { l10nString } from "../../l10n";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";


export interface ScuffrContextMenuItem {
    text: string;
    enabled: boolean;
    action(event: MouseEvent): void;
}

export type ScuffrCtxMenuItem =
    ScuffrCtxMenuItemAction |
    ScuffrCtxMenuItemDivider |
    ScuffrCtxMenuItemSubmenu;

interface ScuffrCtxMenuItemBase {
    type: string;
}

interface ScuffrCtxMenuItemAction extends ScuffrCtxMenuItemBase {
    type: "action",
    text: l10nString,
    disabled?: boolean,
    action(event: MouseEvent): void;
}

interface ScuffrCtxMenuItemDivider extends ScuffrCtxMenuItemBase {
    type: "divider"
}

interface ScuffrCtxMenuItemSubmenu extends ScuffrCtxMenuItemBase {
    type: "submenu",
    text: l10nString,
    items: ScuffrCtxMenuItem[],
    action?(event: MouseEvent): void;
}

class ScuffrContextMenu {
    public readonly items: ScuffrCtxMenuItem[];
    public readonly container: HTMLElement;
    public readonly classes: string[];

    public readonly svg: SVGSVGElement;
    public readonly svgBackground: SVGPathElement;
    public readonly svgMenuContent: SVGForeignObjectElement;

    public readonly htmlContent: HTMLDivElement;

    private readonly _menuDimensions: Vec2;

    private _submenu: ScuffrContextMenu | null;
    private _submenuStable: boolean;

    public constructor(pos: Vec2, items: ScuffrCtxMenuItem[], classes: string[], align: "corner" | "first", container?: HTMLElement, xReflectWidth: number = 0) {
        this.items = items;
        this.container = container ?? document.body.appendChild(document.createElement("div"));
        this.classes = classes;

        this.svg = this.container.appendChild(document.createElementNS(SVG_NS, "svg"));
        this.svg.classList.add("scuff-context-menu");
        this.svg.classList.add(...classes);

        this.svgBackground = this.svg.appendChild(document.createElementNS(SVG_NS, "path"));
        this.svgMenuContent = this.svg.appendChild(document.createElementNS(SVG_NS, "foreignObject"));
        this.svgBackground.classList.add("scuff-context-menu-bg-path");

        this.htmlContent = this.svgMenuContent.appendChild(document.createElement("div"));
        this.htmlContent.classList.add("scuff-block-text", "scuff-context-menu-container");

        this._menuDimensions = { x: 120, y: 20 };
        const dropdownPosition = { x: pos.x - 10, y: pos.y - 10 };

        this.svgMenuContent.setAttribute("width", "99999");
        this.svgMenuContent.setAttribute("height", "99999");

        let contentWidth = 0;
        for (let itemIdx = 0; itemIdx < this.items.length; itemIdx++) {
            const item = this.items[itemIdx];
            const itemDom = this.htmlContent.appendChild(document.createElement("div"));
            let text;
            switch (item.type) {
                case "action":
                    text = itemDom.appendChild(document.createElement("div"));
                    text.innerText = item.text.str;

                    itemDom.classList.add(...classes);
                    itemDom.classList.add("scuff-context-menu-item");

                    if (item.disabled) {
                        itemDom.classList.add("scuff-context-menu-item-disabled");
                    } else {
                        itemDom.addEventListener("click", e => {
                            this.onAction(item);
                            item.action(e);
                        });
                        itemDom.addEventListener("mouseover", e => {
                            if (!this._submenuStable)
                                this._closeSubmenu();
                        });
                    }

                    this._menuDimensions.y += 24;
                    break;
                case "divider":
                    itemDom.classList.add("scuff-context-menu-divider");
                    this._menuDimensions.y += 8;
                    itemDom.appendChild(document.createElement("hr"));
                    break;
                case "submenu":
                    text = itemDom.appendChild(document.createElement("div"));
                    text.innerText = item.text.str;

                    const arrow = itemDom.appendChild(document.createElement("p"));
                    arrow.innerText = ">";

                    const open = () => {
                        if (this._submenu?.items !== item.items) {
                            const itemBounds = itemDom.getBoundingClientRect();
                            this._openSubmenu(item.items, { x: itemBounds.x + itemBounds.width, y: itemBounds.y });
                        }
                    }

                    const action = item.action;
                    if (action) {
                        itemDom.addEventListener("click", e => {
                            this.onAction(item);
                            action(e);
                        });
                    } else {
                        itemDom.addEventListener("click", e => {
                            open();
                            this._submenuStable = true;
                        });
                    }

                    itemDom.addEventListener("mouseover", open);

                    itemDom.classList.add(...classes);
                    itemDom.classList.add("scuff-context-menu-item-submenu", "scuff-context-menu-item");

                    this._menuDimensions.y += 24;
                    break;
            }

            if (text) {
                const textBounds = text.getBoundingClientRect();
                if (textBounds.width > contentWidth) contentWidth = textBounds.width;
            }
        }
        this._menuDimensions.x += contentWidth;

        if (dropdownPosition.x + this._menuDimensions.x + 20 > window.innerWidth) {
            dropdownPosition.x -= this._menuDimensions.x + xReflectWidth;
        }

        if (dropdownPosition.y + this._menuDimensions.y + 20 > window.innerHeight) {
            dropdownPosition.y -= this._menuDimensions.y;
            if (align == "first") dropdownPosition.y += 38;
            if (align == "corner") dropdownPosition.y += 12;
        } else {
            if (align == "first") dropdownPosition.y -= 4;
        }

        this.svgBackground.setAttribute("d", `m 10 14 a 4 4 0 0 1 4 -4 h ${this._menuDimensions.x - 8} a 4 4 0 0 1 4 4 v ${this._menuDimensions.y - 20} a 4 4 0 0 1 -4 4 H 14 a 4 4 0 0 1 -4 -4 z`);

        this.svgMenuContent.setAttribute("x", "10");
        this.svgMenuContent.setAttribute("y", "14");
        this.svgMenuContent.setAttribute("width", "" + (this._menuDimensions.x));
        this.svgMenuContent.setAttribute("height", "" + (this._menuDimensions.y - 20));

        this.svg.style.width = (this._menuDimensions.x + 20) + "px";
        this.svg.style.height = (this._menuDimensions.y + 20) + "px";
        this.svg.style.left = dropdownPosition.x + "px";
        this.svg.style.top = dropdownPosition.y + "px";

        this._submenu = null;
        this._submenuStable = false;
    }

    public onMouseMove(e: MouseEvent) {
        if (this._submenu) {
            if (!this._submenuStable && !this.container.contains(e.target as Node))
                this._closeSubmenu();
            else this._submenu.onMouseMove(e);
        }
    }

    private _openSubmenu(items: ScuffrCtxMenuItem[], position: Vec2) {
        this._closeSubmenu();
        this._submenu = new ScuffrContextMenu(position, items, this.classes, "first", this.container.appendChild(document.createElement("div")), this._menuDimensions.x);
        this._submenu.onAction = this.onAction;
    }

    private _closeSubmenu() {
        if (!this._submenu)
            return;
        this._submenu.close();
        this._submenu = null;
        this._submenuStable = false;
    }

    public onAction = (item: ScuffrCtxMenuItem) => {
        this.close();
    }

    public close() {
        this.container.remove();
    }
}

export class ScuffrInteractionContextMenu extends ScuffrInteraction {

    public readonly menu: ScuffrContextMenu;

    public constructor(root: ScuffrElementScriptContainer, pos: Vec2, items: ScuffrCtxMenuItem[], classes: string[]) {
        super(root);
        this.menu = new ScuffrContextMenu(pos, items, classes, "corner");
        this.menu.onAction = this._menuOnAction;
    }

    private readonly _menuOnAction = (item: ScuffrCtxMenuItem) => {
        this.end();
    }

    public override onEnd(): void {
        this.menu.close();
    }

    public override onMouseWheel(event: MouseEvent): void {
        if (!this.menu.svg.contains(event.target as Node))
            super.onMouseWheel(event);
    }

    public override onMouseDown(event: MouseEvent): void {
        event.preventDefault();
    }

    public override onMouseUp(event: MouseEvent): void {
        if (!this.menu.container.contains(event.target as Node))
            super.onMouseUp(event);
    }

    public override onMouseMove(event: MouseEvent): void {
        if (!this.menu.container.contains(event.target as Node))
            super.onMouseMove(event);
        this.menu.onMouseMove(event);
    }
}