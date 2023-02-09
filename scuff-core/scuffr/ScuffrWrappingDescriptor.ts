import type { BlockPartInput } from "../block/BlockPartInput";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrElementBlock } from "./ScuffrElementBlock";
import { ScuffrElementBlockInstance } from "./ScuffrElementBlockInstance";
import { ScuffrElementScriptInput } from "./ScuffrElementScriptInput";
import type { ScuffrElementScript } from "./ScuffrElementScript";

export class ScuffrWrappingDescriptor {

    public static tryWrap(targetScript: ScuffrElementScript, targetIndex: number, wrapper: ScuffrElementBlock): ScuffrWrappingDescriptor | null {
        if (!(wrapper instanceof ScuffrElementBlockInstance))
            return null;

        for (const input of wrapper.content.inputs) {
            const inputElement = wrapper.content.children[input[1].index];
            if (inputElement instanceof ScuffrElementScriptInput) {
                if (inputElement.children.length !== 0) return null;
                return new ScuffrWrappingDescriptor(targetScript, targetIndex, wrapper, input[1].part, input[1].element as ScuffrElementScriptInput);
            }
        }

        return null;
    }

    public readonly script: ScuffrElementScript;
    public readonly index: number;

    public readonly wrapperBlock: ScuffrElementBlockInstance;
    public readonly wrapperElement: ScuffrElementScriptInput;
    public readonly wrapperInput: BlockPartInput;

    public readonly renderOffset: Vec2;

    private constructor(script: ScuffrElementScript, index: number, block: ScuffrElementBlockInstance, part: BlockPartInput, element: ScuffrElementScriptInput) {
        this.script = script;
        this.index = index;
        this.wrapperBlock = block;
        this.wrapperInput = part;
        this.wrapperElement = element;

        this.renderOffset = { x: 0, y: 0 };

        const renderedLines = block.renderedLines;
        if (renderedLines) {
            const blockLines = block.getContentLines();
            for (let lineIdx = 0; lineIdx < blockLines.length; lineIdx++) {
                if (blockLines[lineIdx].part === this.wrapperElement)
                    break;
                this.renderOffset.y += renderedLines[lineIdx].dimensions.y;
            }

            this.renderOffset.x = 16;
            this.renderOffset.y += 4;
        }
    }
}