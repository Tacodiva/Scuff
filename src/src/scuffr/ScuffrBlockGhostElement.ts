
import type { BlockScript } from '../block/BlockScript';
import type { Vec2 } from '../utils/Vec2';
import { ScuffrBackground, type ScuffrBackgroundContentLine } from './background/ScuffrBackground';
import { ScuffrBackgroundElement } from './background/ScuffrBackgroundElement';
import type { IScuffrBlock } from './IScuffrBlock';
import type { ScuffrBlockInstanceElement } from './ScuffrBlockInstanceElement';
import type { ScuffrBlockRef, IScuffrBlockParent } from './ScuffrBlockRef';
import { ScuffrDummyElement } from './ScuffrDummyElement';
import { ScuffrInputSubscriptElement } from './ScuffrInputSubscriptElement';
import type { ScuffrRootScriptElement } from './ScuffrRootScriptElement';
import type { ScuffrScriptElement } from './ScuffrScriptElement';
import type { ScuffrWrappingDescriptor } from './ScuffrWrappingDescriptor';

export class ScuffrBlockGhostElement extends ScuffrBackgroundElement<ScuffrDummyElement> implements IScuffrBlock {

    public parentRef: ScuffrBlockRef<number, ScuffrScriptElement>;
    public get parent(): ScuffrScriptElement { return this.parentRef.parent; }
    public get index(): number { return this.parentRef.childKey; }
    public readonly sourceBlock: ScuffrBlockInstanceElement;

    public readonly wrapping: ScuffrWrappingDescriptor | null;

    public constructor(parentRef: ScuffrBlockRef<number, ScuffrScriptElement>, sourceBlock: ScuffrBlockInstanceElement, wrapping?: ScuffrWrappingDescriptor | null) {
        super(parentRef.parent, new ScuffrBackground(sourceBlock.background.shape, sourceBlock.background.categoryClass, "scuff-block-ghost"));
        this.parentRef = parentRef;
        this.sourceBlock = sourceBlock;
        this.wrapping = wrapping ?? null;
        this.updateAll();
    }

    protected createContent(): ScuffrDummyElement {
        return new ScuffrDummyElement(this);
    }

    public setParent(parentRef: ScuffrBlockRef<number, ScuffrScriptElement>): void {
        this.parentRef = parentRef;
        this.onAncestryChange(parentRef.parent.getRoot());
    }

    public onAncestryChange(root: ScuffrRootScriptElement | null): void { }

    public shouldAttachUp(): boolean {
        return this.parentRef.childKey === 0;
    }

    public shouldAttachDown(): boolean {
        return false;
    }

    public override getBackgroundContentLines(): ScuffrBackgroundContentLine[] {
        const lines: ScuffrBackgroundContentLine[] = [];
        const sourceLines = this.sourceBlock.getBackgroundContentLines();
        let y = 0;
        for (let sourceLineIdx = 0; sourceLineIdx < sourceLines.length; sourceLineIdx++) {
            const sourceLine = sourceLines[sourceLineIdx];
            const line: ScuffrBackgroundContentLine = {
                dimensions: { x: 0, y: 0 },
                elements: sourceLine.elements
            };
            const part = sourceLine.part;
            if (part instanceof ScuffrInputSubscriptElement) {
                let dimensions;
                if (part === this.wrapping?.wrapperElement) {
                    let wrapHeight = 0;
                    for (let i = this.index; i < this.parent.children.length; i++) {
                        wrapHeight += this.parent.children[i].dimensions.y;
                    }
                    if (wrapHeight < ScuffrInputSubscriptElement.MIN_HEIGHT)
                        wrapHeight = ScuffrInputSubscriptElement.MIN_HEIGHT;
                    dimensions = { x: part.parent.dimensions.x, y: wrapHeight + 8 };
                } else {
                    dimensions = { x: part.parent.dimensions.x, y: ScuffrInputSubscriptElement.MIN_HEIGHT };
                }
                line.modifier = {
                    getPath(size, line) {
                        return part.getPath(size, line, true);
                    },
                };
                line.elements = [new ScuffrDummyElement(this, dimensions)];
            }

            lines.push(line);
        }
        return lines;
    }
}