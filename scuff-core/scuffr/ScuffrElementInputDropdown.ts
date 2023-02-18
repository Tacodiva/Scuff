import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementBlockPartBackground } from "./ScuffrElementBlockPartBackground";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import { ScuffrElementText } from "./ScuffrElementText";
import type { BlockDropdownOption, BlockPartInputDropdown } from "../block";
import { ScuffrElement, ScuffrElementParent } from ".";
import { ScuffrElementIcon } from "./ScuffrElementIcon";

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

export class ScuffrElementInputDropdown extends ScuffrElementBlockPartBackground<Content> implements ScuffrElementInput {
    private _parent: ScuffrElementBlockContent;
    public override get parent(): ScuffrElementBlockContent { return this._parent; }
    public readonly inputType: BlockPartInput;
    public readonly value: BlockDropdownOption;

    public constructor(parent: ScuffrElementBlockContent, shape: ScuffrShape, typeClass: string | null, inputType: BlockPartInput, value: BlockDropdownOption) {
        super(parent.root, parent, {
            shape: shape,
            categoryClass: null,
            typeClass: typeClass
        });
        this._parent = parent;
        this.inputType = inputType;
        this.value = value;
        this.content.children[0].text = this.value.text;
    }

    protected createContent(): Content {
        return new Content(this);
    }

    public asInput(): BlockInput {
        return this.value;
    }

    public setParent(parentRef: ScuffrBlockReference<BlockPartInput<BlockInput>, ScuffrElementBlockContent>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }

    public override onClick(event: MouseEvent): boolean {
        this.workspace.openDropdown(this);
        return true;
    }
}

