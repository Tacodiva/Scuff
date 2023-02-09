import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementBlockPartBackground } from "./ScuffrElementBlockPartBackground";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import { ScuffrElementDummy } from "./ScuffrElementDummy";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";

export class ScuffrElementInputBlank extends ScuffrElementBlockPartBackground<ScuffrElementDummy> implements ScuffrElementInput {
    private _parent: ScuffrElementBlockContent;
    public override get parent(): ScuffrElementBlockContent { return this._parent; }
    public readonly inputType: BlockPartInput;
    public readonly input: BlockInput;

    public constructor(parent: ScuffrElementBlockContent, shape: ScuffrShape, inputType: BlockPartInput, value: BlockInput) {
        super(parent.root, parent, {
            shape,
            categoryClass: null,
            typeClass: "scuff-block-empty"
        });
        this._parent = parent;
        this.inputType = inputType;
        this.input = value;
    }

    protected createContent(): ScuffrElementDummy {
        return new ScuffrElementDummy(this);
    }

    public asInput(): BlockInput {
        return this.input;
    }

    public setParent(parentRef: ScuffrBlockReference<BlockPartInput<BlockInput>, ScuffrElementBlockContent>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
