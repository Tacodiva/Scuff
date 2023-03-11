import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrElementInput } from "./ScuffrElementInput";
import { ScuffrElementInputBase } from "./ScuffrElementBlockInputBase";
import { ScuffrElementDummy } from "./ScuffrElementDummy";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

export class ScuffrElementInputBlank extends ScuffrElementInputBase<ScuffrElementDummy> implements ScuffrElementInput {
    public readonly input: BlockInput;

    public constructor(reference: ScuffrReferenceInput, shape: ScuffrShape, value: BlockInput) {
        super(reference, {
            shape,
            categoryClasses: [],
            typeClasses: ["scuff-block-empty"]
        });
        this.input = value;
    }
    
    protected createContent(): ScuffrElementDummy {
        return new ScuffrElementDummy(this);
    }

    public asInput(): BlockInput {
        return this.input;
    }
}
