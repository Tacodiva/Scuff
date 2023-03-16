import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementInputBase } from "./ScuffrElementBlockInputBase";
import type { ScuffrShape } from "./shape/ScuffrShape";
import { ScuffrElementText } from "./ScuffrElementText";
import type { BlockDropdownOption } from "../block";
import { ScuffrElementParent } from ".";
import { ScuffrElementIcon } from "./ScuffrElementIcon";
import { ScuffrInteractionDropdown } from "./interactions/ScuffrInteractionDropdown";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

class Content extends ScuffrElementParent {
    public children: readonly [ScuffrElementText, ScuffrElementIcon];
    public parent: ScuffrElementInputDropdown;

    constructor(parent: ScuffrElementInputDropdown) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.parent = parent;
        this.children = [
            new ScuffrElementText(this, ""),
            new ScuffrElementIcon(this, "scuff-block-dropdown-arrow", { x: 12, y: 12 })
        ];
    }
}

export class ScuffrElementInputDropdown extends ScuffrElementInputBase<Content> implements ScuffrElementInput {
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
        this.workspace.startInteraction(new ScuffrInteractionDropdown(this))
        return true;
    }
}

