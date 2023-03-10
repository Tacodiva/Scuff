
import { ScuffrElementShape } from './ScuffrElementShape';
import type { ScuffrElementBlock } from './ScuffrElementBlock';
import type { ScuffrElementBlockInstance } from './ScuffrElementBlockInstance';
import type { ScuffrBlockReference, ScuffrBlockReferenceParent } from './ScuffrBlockReference';
import { ScuffrElementDummy } from './ScuffrElementDummy';
import { ScuffrElementScriptInput } from './ScuffrElementScriptInput';
import type { ScuffrElementScriptRoot } from './ScuffrElementScriptRoot';
import type { ScuffrElementScript } from './ScuffrElementScript';
import type { ScuffrWrappingDescriptor } from './ScuffrWrappingDescriptor';
import type { ScuffrShapeContentLine } from './shape/ScuffrShapeContentLine';

export class ScuffrElementBlockGhost extends ScuffrElementShape<ScuffrElementDummy> implements ScuffrElementBlock {

    public parentRef: ScuffrBlockReference<number, ScuffrElementScript>;
    public get parent(): ScuffrElementScript { return this.parentRef.parent; }
    public get index(): number { return this.parentRef.childKey; }
    public readonly sourceBlock: ScuffrElementBlockInstance;

    public readonly wrapping: ScuffrWrappingDescriptor | null;

    public constructor(parentRef: ScuffrBlockReference<number, ScuffrElementScript>, sourceBlock: ScuffrElementBlockInstance, wrapping?: ScuffrWrappingDescriptor | null) {
        super(parentRef.parent,
            {
                shape: sourceBlock.getBackground().shape,
                categoryClasses: sourceBlock.shape.categoryClasses,
                typeClasses: ["scuff-block-ghost"]
            });
        this.parentRef = parentRef;
        this.sourceBlock = sourceBlock;
        this.wrapping = wrapping ?? null;
        this.updateAll();
    }

    protected createContent(): ScuffrElementDummy {
        return new ScuffrElementDummy(this);
    }

    public setParent(parentRef: ScuffrBlockReference<number, ScuffrElementScript>): void {
        this.parentRef = parentRef;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public onAncestryChange(root: ScuffrElementScriptRoot | null): void { }

    public shouldAttachUp(): boolean {
        return this.parentRef.childKey === 0;
    }

    public shouldAttachDown(): boolean {
        return false;
    }

    public override getContentLines(): ScuffrShapeContentLine[] {
        const lines: ScuffrShapeContentLine[] = [];
        const sourceLines = this.sourceBlock.getContentLines();
        let y = 0;
        for (let sourceLineIdx = 0; sourceLineIdx < sourceLines.length; sourceLineIdx++) {
            const sourceLine = sourceLines[sourceLineIdx];
            const line: ScuffrShapeContentLine = {
                dimensions: { x: 0, y: 0 },
                elements: sourceLine.elements
            };
            const part = sourceLine.part;
            if (part instanceof ScuffrElementScriptInput) {
                let dimensions;
                if (part === this.wrapping?.wrapperElement) {
                    let wrapHeight = 0;
                    for (let i = this.index; i < this.parent.children.length; i++) {
                        wrapHeight += this.parent.children[i].dimensions.y;
                    }
                    if (wrapHeight < ScuffrElementScriptInput.MIN_HEIGHT)
                        wrapHeight = ScuffrElementScriptInput.MIN_HEIGHT;
                    dimensions = { x: part.parent.dimensions.x, y: wrapHeight + 8 };
                } else {
                    dimensions = { x: part.parent.dimensions.x, y: ScuffrElementScriptInput.MIN_HEIGHT };
                }
                line.modifier = {
                    getPath(size, shape, line) {
                        return part.getPath(size, shape, line, true);
                    },
                };
                line.elements = [new ScuffrElementDummy(this, dimensions)];
            }

            lines.push(line);
        }
        return lines;
    }
}