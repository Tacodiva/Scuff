import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementBlockPartBackground } from "./ScuffrElementBlockPartBackground";
import type { ScuffrBlockReference } from "./ScuffrBlockReference";
import { ScuffrElementText } from "./ScuffrElementText";
import type { BlockInputLiteral } from "../block/BlockInputLiteral";
import type { ScuffrElementBlockContent } from "./ScuffrElementBlockContent";
import { ScuffrShapeInputRound } from "./shape/ScuffrShapeInputRound";
import type { ScuffrShape } from "./shape";

export class ScuffrElementInputLiteral extends ScuffrElementBlockPartBackground<ScuffrElementText> implements ScuffrElementInput {
    public static readonly shape: ScuffrShape = new ScuffrShapeInputRound();

    private _parent: ScuffrElementBlockContent;
    public override get parent(): ScuffrElementBlockContent { return this._parent; }
    public readonly inputType: BlockPartInput;
    private _input: BlockInputLiteral;

    public constructor(parent: ScuffrElementBlockContent, input: BlockPartInput, value: BlockInputLiteral) {
        super(parent.root, parent, {
            shape: ScuffrElementInputLiteral.shape,
            categoryClass: null,
            typeClass: "scuff-input"
        });
        this._parent = parent;
        this.inputType = input;
        this._input = value;
        this.content.text = this._input.value;
    }

    protected createContent(): ScuffrElementText {
        return new ScuffrElementText(this, "");
    }

    public setValue(value: string) {
        this._input.value = value;
        this.content.text = value;
        this.content.update(false);
        this.update(true);
    }

    public override onClick(event: MouseEvent): boolean {
        event.preventDefault();
        this.workspace.editLiteralInput(this);
        return true;
    }

    public asInput(): BlockInput {
        return this._input;
    }

    public setParent(parentRef: ScuffrBlockReference<BlockPartInput<BlockInput>, ScuffrElementBlockContent>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
