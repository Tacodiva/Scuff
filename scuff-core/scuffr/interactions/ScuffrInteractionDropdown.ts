import type { BlockDropdownOption } from "../../block";
import { ScuffrCmdSetInputDropdown } from "../commands/ScuffrCmdSetInputDropdown";
import type { ScuffrSvgInputDropdown } from "../ScuffrSvgInputDropdown";
import type { ScuffrWorkspace } from "../ScuffrWorkspace";
import { ScuffrInteraction } from "./ScuffrInteraction";

export class ScuffrInteractionDropdown extends ScuffrInteraction {
    public static readonly MAX_HEIGHT = 300;

    public readonly scuffrInput: ScuffrSvgInputDropdown;
    public readonly displayedOptions: BlockDropdownOption[];
    public readonly allOptions: BlockDropdownOption[];
    public highlightIndex: number;

    public readonly svgMenu: SVGSVGElement;
    public readonly svgBackground: SVGPathElement;
    public readonly svgMenuContent: SVGForeignObjectElement;

    public readonly htmlContent: HTMLDivElement;
    public readonly htmlOptionContainer: HTMLDivElement;
    public readonly htmlInput: HTMLInputElement;

    public constructor(dropdown: ScuffrSvgInputDropdown) {
        super(dropdown.workspace);
        this.scuffrInput = dropdown;

        this.svgMenu = document.body.appendChild(document.createElementNS(SVG_NS, "svg"));
        this.svgMenu.classList.add("scuff-dropdown");
        this.svgMenu.classList.add(...dropdown.parent.parent.shape.categoryClasses);

        this.svgBackground = this.svgMenu.appendChild(document.createElementNS(SVG_NS, "path"));
        this.svgMenuContent = this.svgMenu.appendChild(document.createElementNS(SVG_NS, "foreignObject"));
        this.svgBackground.classList.add("scuff-dropdown-bg-path");

        this.htmlContent = this.svgMenuContent.appendChild(document.createElement("div"));
        this.htmlContent.classList.add("scuff-dropdown-container");
        this.htmlInput = this.htmlContent.appendChild(document.createElement("input"));
        this.htmlInput.classList.add("scuff-dropdown-search", "scuff-block-text");

        this.htmlOptionContainer = this.htmlContent.appendChild(document.createElement("div"));
        this.htmlOptionContainer.classList.add("scuff-dropdown-option-container", "scuff-block-text");

        const menuDimensions = { x: 137, y: 20 };

        let contentWidth = 0;
        this.allOptions = dropdown.value.provider.getOptions(dropdown.parent.block);
        this.displayedOptions = [];

        this._updateOptions();

        for (const optionDom of this.htmlOptionContainer.children) {
            const optionBounds = optionDom.getBoundingClientRect();
            if (optionBounds.width > contentWidth) contentWidth = optionBounds.width;
        }
        menuDimensions.x += contentWidth;
        if (this.displayedOptions.length * 32 + 32 > ScuffrInteractionDropdown.MAX_HEIGHT) menuDimensions.y += ScuffrInteractionDropdown.MAX_HEIGHT;
        else menuDimensions.y += this.displayedOptions.length * 32 + 32;

        const inputBounds = dropdown.dom.getBoundingClientRect();

        const dropdownPosition = { x: inputBounds.x, y: inputBounds.y };
        dropdownPosition.x += (inputBounds.width - 20) / 2;
        dropdownPosition.x -= menuDimensions.x / 2;
        if (inputBounds.y + menuDimensions.y + 20 + inputBounds.height > window.innerHeight && inputBounds.y - menuDimensions.y - 20 > 0) {
            dropdownPosition.y -= menuDimensions.y + 20;
            this.svgBackground.setAttribute("d", `m 10 20 a 4 4 0 0 1 4 -4 h ${menuDimensions.x - 8} a 4 4 0 0 1 4 4 v ${menuDimensions.y - 20} a 4 4 0 0 1 -4 4 h ${-(menuDimensions.x / 2 - 8)} l -11 11 a 1.5 1.5 0 0 1 -2 0 l -11 -11 H 14 a 4 4 0 0 1 -4 -4 z`);
            this.svgMenu.style.transform = "translate(0px, -10px)";
        } else {
            dropdownPosition.y += inputBounds.height;
            this.svgBackground.setAttribute("d", `m 10 20 a 4 4 0 0 1 4 -4 h ${menuDimensions.x / 2 - 16} l 11 -11 a 1.5 1.5 0 0 1 2 0 l 11 11 h ${menuDimensions.x / 2 - 16} a 4 4 0 0 1 4 4 v ${menuDimensions.y - 20} a 4 4 0 0 1 -4 4 H 14 a 4 4 0 0 1 -4 -4 z`);
            this.svgMenu.style.transform = "translate(0px, 10px)";
        }

        this.svgMenuContent.setAttribute("x", "14");
        this.svgMenuContent.setAttribute("y", "20");
        this.svgMenuContent.setAttribute("width", "" + (menuDimensions.x - 8));
        this.svgMenuContent.setAttribute("height", "" + (menuDimensions.y - 20));

        this.svgMenu.style.position = "absolute";
        this.svgMenu.style.width = (menuDimensions.x + 20) + "px";
        this.svgMenu.style.height = (menuDimensions.y + 20) + "px";
        this.svgMenu.style.left = dropdownPosition.x + "px";
        this.svgMenu.style.top = dropdownPosition.y + "px";

        this.highlightIndex = -1;
        this.htmlInput.focus();
        this.htmlInput.oninput = () => {
            this._updateOptions();
        };
        window.addEventListener("keydown", this._keypressListener);
    }

    private _setOption(option: BlockDropdownOption) {
        if (this.scuffrInput.value.id !== option.id) {
            this.workspace.submitCommand(
                new ScuffrCmdSetInputDropdown(this.scuffrInput, option)
            );
        }
    }

    private _keypressListener = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            if (this.highlightIndex > 0)
                this._setHighlight(this.highlightIndex - 1);
        } else if (e.key === "ArrowDown") {
            this._setHighlight((this.highlightIndex + 1) % this.displayedOptions.length);
        } else if (e.key === "Enter") {
            let idx = 0;
            if (this.highlightIndex !== -1) idx = this.highlightIndex;
            if (idx < this.displayedOptions.length) {
                this._setOption(this.displayedOptions[idx]);
            }
            this.end();
        }
    }

    private _updateOptions() {
        const search = this.htmlInput.value.trim().toLowerCase();
        this.displayedOptions.length = 0;
        if (search.length === 0) {
            this.displayedOptions.push(...this.allOptions);
        } else {
            for (const option of this.allOptions) {
                if (option.text.toLowerCase().indexOf(search) !== -1)
                    this.displayedOptions.push(option);
            }
            this.displayedOptions.sort((a, b) => a.text.length - b.text.length);
        }

        this.highlightIndex = -1;
        this.htmlOptionContainer.innerHTML = "";
        for (let optionIdx = 0; optionIdx < this.displayedOptions.length; optionIdx++) {
            const option = this.displayedOptions[optionIdx];
            const optionDom = this.htmlOptionContainer.appendChild(document.createElement("div"));
            optionDom.classList.add("scuff-dropdown-item");
            const tick = optionDom.appendChild(document.createElementNS(SVG_NS, "svg"));
            if (this.scuffrInput.value.id === option.id) {
                tick.appendChild(document.createElementNS(SVG_NS, "use")).setAttribute("href", "#scuff-block-tick");
            }
            optionDom.appendChild(document.createTextNode(option.text));
            optionDom.addEventListener("click", e => {
                this._setOption(option);
                this.end();
            });
            optionDom.addEventListener("mousemove", e => {
                this._setHighlight(optionIdx);
            });
        }
    }

    private _setHighlight(index: number) {
        if (this.highlightIndex !== -1)
            this.htmlOptionContainer.children[this.highlightIndex].classList.remove("scuff-dropdown-item-highlight");
        this.highlightIndex = index;
        if (this.highlightIndex !== -1)
            this.htmlOptionContainer.children[this.highlightIndex].classList.add("scuff-dropdown-item-highlight");
    }

    public override onEnd(): void {
        this.svgMenu.remove();
        window.removeEventListener("keypress", this._keypressListener);
    }

    public override onMouseWheel(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseWheel(event);
    }

    public override onMouseDown(event: MouseEvent): void {
        event.preventDefault();
    }

    public override onMouseUp(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseUp(event);
    }

    public override onMouseMove(event: MouseEvent): void {
        if (!this.svgMenu.contains(event.target as Node))
            super.onMouseMove(event);
    }
}
