import type { BlockDropdownOption } from "../../block";
import type { ScuffrElementInputDropdown } from "../ScuffrElementInputDropdown";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";

export class ScuffrInteractionDropdown extends ScuffrInteraction {
    public static readonly MAX_HEIGHT = 300;

    public readonly scuffrInput: ScuffrElementInputDropdown;
    public readonly options: BlockDropdownOption[];

    public readonly svgMenu: SVGSVGElement;
    public readonly svgBackground: SVGPathElement;
    public readonly svgMenuContent: SVGForeignObjectElement;

    public readonly htmlContent: HTMLDivElement;
    public readonly htmlInput: HTMLInputElement;

    public constructor(workspace: ScuffrWorkspace, dropdown: ScuffrElementInputDropdown) {
        super(workspace);
        this.scuffrInput = dropdown;

        this.svgMenu = document.body.appendChild(document.createElementNS(SVG_NS, "svg"));
        this.svgMenu.classList.add("scuff-dropdown");
        this.svgMenu.classList.add(...dropdown.parent.parent.shape.categoryClass?.split(" ") ?? []);

        this.svgBackground = this.svgMenu.appendChild(document.createElementNS(SVG_NS, "path"));
        this.svgMenuContent = this.svgMenu.appendChild(document.createElementNS(SVG_NS, "foreignObject"));
        this.svgBackground.classList.add("scuff-dropdown-bg-path");

        this.htmlContent = this.svgMenuContent.appendChild(document.createElement("div"));
        this.htmlContent.classList.add("scuff-dropdown-container", "scuff-block-text");
        this.htmlInput = this.htmlContent.appendChild(document.createElement("input"));
        this.htmlInput.classList.add("scuff-dropdown-search", "scuff-block-text");

        const menuDimensions = { x: 137, y: 20 };

        let contentWidth = 0;
        this.options = dropdown.value.provider.getOptions(dropdown.parent.parent.block);

        for (const option of this.options) {
            const optionDom = this.htmlContent.appendChild(document.createElement("div"));
            optionDom.classList.add("scuff-dropdown-item");
            optionDom.innerText = option.text;
            const optionBounds = optionDom.getBoundingClientRect();
            if (optionBounds.width > contentWidth) contentWidth = optionBounds.width;
        }
        menuDimensions.x += contentWidth;
        if (this.options.length * 32 + 32 > ScuffrInteractionDropdown.MAX_HEIGHT) menuDimensions.y += ScuffrInteractionDropdown.MAX_HEIGHT;
        else menuDimensions.y += this.options.length * 32 + 32;

        const inputBounds = dropdown.dom.getBoundingClientRect();
        const dropdownPosition = { x: inputBounds.x, y: inputBounds.y };
        dropdownPosition.x += (inputBounds.width - 20) / 2;
        dropdownPosition.y += inputBounds.height;
        dropdownPosition.x -= menuDimensions.x / 2;

        this.svgBackground.setAttribute("d", `m 10 20 a 4 4 0 0 1 4 -4 h ${menuDimensions.x / 2 - 16} l 11 -11 a 1.5 1.5 0 0 1 2 0 l 11 11 h ${menuDimensions.x / 2 - 16} a 4 4 0 0 1 4 4 v ${menuDimensions.y - 20} a 4 4 0 0 1 -4 4 H 14 a 4 4 0 0 1 -4 -4 z`);

        this.svgMenuContent.setAttribute("x", "14");
        this.svgMenuContent.setAttribute("y", "20");
        this.svgMenuContent.setAttribute("width", "" + (menuDimensions.x - 8));
        this.svgMenuContent.setAttribute("height", "" + (menuDimensions.y - 20));

        this.svgMenu.style.position = "absolute";
        this.svgMenu.style.width = (menuDimensions.x + 20) + "px";
        this.svgMenu.style.height = (menuDimensions.y + 20) + "px";
        this.svgMenu.style.left = dropdownPosition.x + "px";
        this.svgMenu.style.top = dropdownPosition.y + "px";
        this.svgMenu.style.transform = "translate(0px, 10px)";

        this.htmlInput.focus();
    }

    public override onEnd(): void {
        console.log("Ended.");
        this.svgMenu.remove();
    }

    public override onMouseWheel(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseWheel(event);
    }

    public override onMouseDown(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseDown(event);
    }

    public override onMouseUp(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseUp(event);
    }
}
