import type { BlockInput } from "../../block/BlockInput";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import { ScuffrSvgInputBase } from "./ScuffrSvgBlockInputBase";
import type { ScuffrShape } from "../shape/ScuffrShape";
import { ScuffrSvgText } from "./ScuffrSvgText";
import type { BlockDropdownOption } from "../../block";
import { ScuffrSvgIcon } from "./ScuffrSvgIcon";
import { ScuffrInteractionDropdown } from "../interactions/ScuffrInteractionDropdown";
import type { ScuffrReferenceInput } from "../ScuffrReferenceTypes";
import { ScuffrSvgElementParent } from "./ScuffrSvgElementParent";

class Content extends ScuffrSvgElementParent {
    public children: readonly [ScuffrSvgText, ScuffrSvgIcon];
    public parent: ScuffrSvgInputDropdown;

    constructor(parent: ScuffrSvgInputDropdown) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [
            new ScuffrSvgText(this, ""),
            new ScuffrSvgIcon(this, "scuff-block-dropdown-arrow", { x: 12, y: 12 })
        ];
    }
}

export class ScuffrSvgInputDropdown extends ScuffrSvgInputBase<Content> implements ScuffrSvgInput {
    private _value: BlockDropdownOption;
    public get value() { return this._value; }

    public constructor(reference: ScuffrReferenceInput, shape: ScuffrShape, typeClasses: string[], value: BlockDropdownOption) {
        super(reference, {
            shape: shape,
            categoryClasses: [],
            typeClasses
        });
        this._value = value;
        this.content.children[0].text = this._value.text;
    }

    protected createContent(): Content {
        return new Content(this);
    }

    public asInput(): BlockInput {
        return this._value;
    }

    public setValue(value: BlockDropdownOption) {
        this._value = value;
        this.parent.block.setInput(this.inputType, value);
        this.content.children[0].setText(value.text);
    }

    public override onClick(event: MouseEvent): boolean {
        new ScuffrInteractionDropdown(this).start();
        return true;
    }
}

