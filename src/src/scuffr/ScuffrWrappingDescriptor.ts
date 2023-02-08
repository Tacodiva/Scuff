import type { BlockInputType } from "../block/BlockInputType";
import type { Vec2 } from "../utils/Vec2";
import type { IScuffrBlock } from "./IScuffrBlock";
import type { ScuffrBlockContentInput } from "./ScuffrBlockContentElement";
import { ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrInputSubscriptElement } from "./ScuffrInputSubscriptElement";
import type { ScuffrScriptElement } from "./ScuffrScriptElement";

export class ScuffrWrappingDescriptor {

    public static tryWrap(targetScript: ScuffrScriptElement, targetIndex: number, wrapper: IScuffrBlock): ScuffrWrappingDescriptor | null {
        if (!(wrapper instanceof ScuffrBlockInstanceElement))
            return null;

        for (const input of wrapper.content.inputs) {
            const inputElement = wrapper.content.children[input[1].index];
            if (inputElement instanceof ScuffrInputSubscriptElement) {
                if (inputElement.children.length !== 0) return null;
                return new ScuffrWrappingDescriptor(targetScript, targetIndex, wrapper, input[1]);
            }
        }

        return null;
    }

    public readonly script: ScuffrScriptElement;
    public readonly index: number;

    public readonly wrapperBlock: ScuffrBlockInstanceElement;
    public readonly wrapperElement: ScuffrInputSubscriptElement;
    public readonly wrapperInput: BlockInputType;

    public readonly renderOffset: Vec2;

    private constructor(script: ScuffrScriptElement, index: number, block: ScuffrBlockInstanceElement, input: ScuffrBlockContentInput) {
        this.script = script;
        this.index = index;
        this.wrapperBlock = block;
        this.wrapperInput = input.part;
        this.wrapperElement = input.element as ScuffrInputSubscriptElement;

        this.renderOffset = { x: 0, y: 0 };

        const renderedLines = block.renderedLines;
        if (renderedLines) {
            const blockLines = block.getBackgroundContentLines();
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