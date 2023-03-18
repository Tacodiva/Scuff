
import { ScuffrSvgShape } from './ScuffrSvgShape';
import type { ScuffrSvgBlock } from './ScuffrSvgBlock';
import type { ScuffrSvgBlockInstance } from './ScuffrSvgBlockInstance';
import { ScuffrSvgDummy } from './ScuffrSvgDummy';
import { ScuffrSvgScriptInput } from './ScuffrSvgScriptInput';
import type { ScuffrSvgScriptRoot } from './ScuffrSvgScriptRoot';
import type { ScuffrSvgScript } from './ScuffrSvgScript';
import { ScuffrWrapInfo } from './ScuffrWrappingDescriptor';
import type { ScuffrShapeContentLine } from './shape/ScuffrShapeContentLine';
import type { ScuffrLinkReference, ScuffrReference } from './ScuffrReference';

export class ScuffrSvgBlockGhost extends ScuffrSvgShape<ScuffrSvgDummy> implements ScuffrSvgBlock {

    public reference: ScuffrLinkReference<ScuffrSvgBlock, ScuffrSvgScript>;
    public get parent(): ScuffrSvgScript { return this.reference.parent; }
    public get index(): number { return this.reference.index; }
    public readonly sourceBlock: ScuffrSvgBlockInstance;

    public readonly wrapping: ScuffrWrapInfo | null;

    public constructor(parentRef: ScuffrLinkReference<ScuffrSvgBlock, ScuffrSvgScript>, sourceBlock: ScuffrSvgBlockInstance, tryWrap: boolean) {
        super(parentRef.parent,
            {
                shape: sourceBlock.getBackground().shape,
                categoryClasses: sourceBlock.shape.categoryClasses,
                typeClasses: ["scuff-block-ghost"]
            });
        this.reference = parentRef;
        this.sourceBlock = sourceBlock;

        if (tryWrap) {
            const input = this.sourceBlock.getWrapperInput();
            this.wrapping = (input === null) ? null : new ScuffrWrapInfo(input);
        } else this.wrapping = null;
        
        this.updateAll();
    }

    public getReferenceValue(index: number) {
        throw new Error('Ghost blocks do not have any children.');
    }

    public getReference(): ScuffrReference<this> {
        return this.reference as any;
    }

    protected createContent(): ScuffrSvgDummy {
        return new ScuffrSvgDummy(this);
    }

    public setParent(reference: ScuffrLinkReference<ScuffrSvgBlock, ScuffrSvgScript>): void {
        this.reference = reference;
        this.onAncestryChange(reference.parent.getRoot());
    }

    public onAncestryChange(root: ScuffrSvgScriptRoot | null): void { }

    public shouldAttachUp(): boolean {
        return this.reference.index === 0;
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
            if (part instanceof ScuffrSvgScriptInput) {
                let dimensions;
                if (part === this.wrapping?.wrappingInput) {
                    let wrapHeight = 0;
                    for (let i = this.index; i < this.parent.children.length; i++) {
                        wrapHeight += this.parent.children[i].dimensions.y;
                    }
                    if (wrapHeight < ScuffrSvgScriptInput.MIN_HEIGHT)
                        wrapHeight = ScuffrSvgScriptInput.MIN_HEIGHT;
                    dimensions = { x: part.parent.dimensions.x, y: wrapHeight + 8 };
                } else {
                    dimensions = { x: part.parent.dimensions.x, y: ScuffrSvgScriptInput.MIN_HEIGHT };
                }
                line.modifier = {
                    getPath(size, shape, line) {
                        return part.getPath(size, shape, line, true);
                    },
                };
                line.elements = [new ScuffrSvgDummy(this, dimensions)];
            }

            lines.push(line);
        }
        return lines;
    }
}