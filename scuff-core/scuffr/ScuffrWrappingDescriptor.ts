import type { ScuffrElementScriptInput } from ".";
import type { Vec2 } from "../utils/Vec2";

export class ScuffrWrapInfo {
    public readonly wrappingInput: ScuffrElementScriptInput;
    public get wrappingBlock() { return this.wrappingInput.parent.parent; }

    public readonly renderOffset: Vec2;

    public constructor(wrappingInput: ScuffrElementScriptInput) {
        this.wrappingInput = wrappingInput;

        this.renderOffset = { x: 0, y: 0 };

        const renderedLines = this.wrappingBlock.renderedLines;

        if (renderedLines) {
            const blockLines = this.wrappingBlock.getContentLines();
            for (let lineIdx = 0; lineIdx < blockLines.length; lineIdx++) {
                if (blockLines[lineIdx].part === this.wrappingInput)
                    break;
                this.renderOffset.y += renderedLines[lineIdx].dimensions.y;
            }

            this.renderOffset.x = 16;
            this.renderOffset.y += 4;
        }
    }
}