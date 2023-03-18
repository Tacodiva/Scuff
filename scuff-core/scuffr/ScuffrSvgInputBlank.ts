import type { BlockPartInput } from "../block/BlockPartInput";
import type { BlockInput } from "../block/BlockInput";
import type { ScuffrSvgInput } from "./ScuffrSvgInput";
import { ScuffrSvgInputBase } from "./ScuffrSvgBlockInputBase";
import { ScuffrSvgDummy } from "./ScuffrSvgDummy";
import type { ScuffrShape } from "./shape/ScuffrShape";
import type { ScuffrReferenceInput } from "./ScuffrReferenceTypes";

export class ScuffrSvgInputBlank extends ScuffrSvgInputBase<ScuffrSvgDummy> implements ScuffrSvgInput {
    public readonly input: BlockInput;

    public constructor(reference: ScuffrReferenceInput, shape: ScuffrShape, value: BlockInput) {
        super(reference, {
            shape,
            categoryClasses: [],
            typeClasses: ["scuff-block-empty"]
        });
        this.input = value;
    }
    
    protected createContent(): ScuffrSvgDummy {
        return new ScuffrSvgDummy(this);
    }

    public asInput(): BlockInput {
        return this.input;
    }
}
