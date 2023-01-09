import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";
import { ScuffrAttachmentPointList, ScuffrScriptAttachmentPoint, type ScuffrAttachmentPoint } from "./ScuffrAttachmentPoint";
import type { IScuffrBlockPartElement, ScuffrBlockInstanceElement } from "./ScuffrBlockInstanceElement";
import { ScuffrBlockRef, type IScuffrBlockParent } from "./ScuffrBlockRef";
import { BlockScript, BlockScriptInput, BlockScriptRoot } from "../block/BlockScript";
import type { BlockInstance } from "../block/BlockInstance";
import type { IScuffrBackgroundModifier, ScuffrBackground, ScuffrBackgroundContentLine } from "./ScuffrBackground";
import type { Vec2 } from "../utils/Vec2";

export abstract class ScuffrScriptElement<TScript extends BlockScript> extends ScuffrParentElement implements IScuffrBlockParent<number> {
    public readonly children: ScuffrBlockInstanceElement[];
    public readonly script: TScript;
    private readonly _root: ScuffrRootScriptElement | null;

    public readonly attachmentPoints: ScuffrAttachmentPointList;

    public constructor(container : SVGElement, root: ScuffrRootScriptElement | null, workspace: ScuffrWorkspace, script: TScript | ScuffrBlockInstanceElement[], typeScript: { new(blocks: BlockInstance[]): TScript; }) {
        super(container.appendChild(document.createElementNS(SVG_NS, "g")), workspace);
        if (root) this._root = root;
        else this._root = this.getRoot();

        this.attachmentPoints = new ScuffrAttachmentPointList(this._root);

        if (script instanceof BlockScript) {
            this.children = [];
            this.script = script;

            for (let i = 0; i < this.script.blocks.length; i++)
                this.children.push(this._renderBlock(i));
        } else {
            this.script = new typeScript /*applause*/(script.flatMap(script => script.block));
            this.children = script;

            this.translationSelf = script[0].getAbsoluteTranslation();
            this.translationSelf.x += script[0].leftOffset;
            this.updateTraslation();

            for (let i = 0; i < script.length; i++) {
                this.dom.appendChild(script[i].dom);
                script[i].setParent(new ScuffrBlockRef(i, this));
            }

            this.update(true);
        }
    }

    public getRoot(): ScuffrRootScriptElement {
        if (!this._root) throw new Error("Script has no root!");
        return this._root;
    }

    public getBlock(key: number): ScuffrBlockInstanceElement | null {
        return this.children[key];
    }

    public insertScript(index: number, script: ScuffrRootScriptElement) {
        this.script.blocks.splice(index, 0, ...script.script.blocks);
        for (let i = index; i < index + script.script.blocks.length; i++) {
            const rendered = this._renderBlock(i);
            rendered.updateAll();
            this.children.splice(i, 0, rendered);
        }
        if (index === 0)
            this.translationSelf.y += this.topOffset - script.bottomOffset;
        this.workspace.deleteRenderedScript(script);
        this.update(true);
    }

    private _renderBlock(index: number) {
        return this.script.blocks[index].render(null, new ScuffrBlockRef(index, this));
    }

    public override update(propagateUp: boolean) {
        this.updateTraslation();
        this.attachmentPoints.clear();

        let x = 0;
        let y = 0;

        for (let blockIdx = 0; blockIdx < this.script.blocks.length; blockIdx++) {
            const renderedBlock = this.children[blockIdx];
            renderedBlock.parentRef.childKey = blockIdx;
            const block = renderedBlock.block;

            const dimensions = renderedBlock.dimensions;
            const height = dimensions.y;
            renderedBlock.translationParent.x = 0;
            if (blockIdx === 0) {
                renderedBlock.translationParent.y = 0;
                y += height / 2;
            } else {
                const yTrans = y + height / 2;
                renderedBlock.translationParent.y = yTrans;
                y += height;
            }
            renderedBlock.updateTraslation();
            if (dimensions.x > x) x = dimensions.x

            if (blockIdx === 0) {
                if (block.type.canStackUp(block))
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this.getRoot(), 0, false, true, { x: 0, y: - height / 2 }))
            }
            if (block.type.canStackDown(block))
                if (blockIdx === this.script.blocks.length - 1)
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this.getRoot(), blockIdx + 1, true, false, { x: 0, y }))
                else
                    this.attachmentPoints.push(new ScuffrScriptAttachmentPoint(this.getRoot(), blockIdx + 1, true, true, { x: 0, y }))
        }

        if (this.script.blocks.length !== 0)
            this.topLeftOffset = { x: 0, y: this.children[0].dimensions.y / 2 };
        else
            this.topLeftOffset = { x: 0, y: 0 };

        this.dimensions = { x, y: y + this.topLeftOffset.y };
        super.update(propagateUp);
    }

    public onChildDrag?(key: number, event: MouseEvent): boolean {
        if (key === 0) {
            this.workspace.dragRenderedScript(this.toRootScript(), event);
            return true;
        }

        const draggedChild = this.children[key];
        const pos = draggedChild.getAbsoluteTranslation();
        pos.x += draggedChild.leftOffset;

        this.script.blocks.splice(key);
        const draggedBlocks = this.children.splice(key);
        const newScript = new ScuffrRootScriptElement(this.workspace, draggedBlocks);
        this.workspace.addRenderedScript(newScript);
        this.workspace.dragRenderedScript(newScript, event);
        this.update(true);
        return true;
    }

    public abstract toRootScript(): ScuffrRootScriptElement;
}

export class ScuffrRootScriptElement extends ScuffrScriptElement<BlockScriptRoot> {

    public readonly parent: ScuffrWorkspace;

    public constructor(workspace: ScuffrWorkspace, script: BlockScriptRoot);

    public constructor(workspace: ScuffrWorkspace, block: ScuffrBlockInstanceElement[]);

    public constructor(workspace: ScuffrWorkspace, content: BlockScriptRoot | ScuffrBlockInstanceElement[]) {
        super(workspace.svgScriptContainer, null, workspace, content, BlockScriptRoot);
        this.parent = workspace;
        if (content instanceof BlockScript)
            this.translationSelf = content.translation;
    }

    public override getRoot(): ScuffrRootScriptElement {
        return this;
    }

    public override updateTraslation() {
        this.script.translation.x = this.translationSelf.x;
        this.script.translation.y = this.translationSelf.y;
        super.updateTraslation();
    }

    public remove() {
        for (const child of this.children)
            child.onAncestryChange(null);
        this.dom.remove();
        this.attachmentPoints.delete();
    }

    public toRootScript(): ScuffrRootScriptElement {
        return this;
    }
}

export class ScuffrInputScriptElement extends ScuffrScriptElement<BlockScriptInput> implements IScuffrBlockPartElement, IScuffrBackgroundModifier {
    public readonly parent: ScuffrBlockInstanceElement;

    public constructor(parent: ScuffrBlockInstanceElement, script: BlockScriptInput);

    public constructor(parent: ScuffrBlockInstanceElement, block: ScuffrBlockInstanceElement[]);

    public constructor(parent: ScuffrBlockInstanceElement, script: BlockScriptInput | ScuffrBlockInstanceElement[]) {
        super(parent.dom, parent.root, parent.workspace, script, BlockScriptInput);
        this.parent = parent;
    }

    public override update(propagateUp: boolean): void {
        super.update(false);
        // this.dimensions.x = 120;
        // this.dimensions.y = 120; //36
        // this.dom.innerHTML = "";
        // this.dom.innerHTML = `<rect x="0" y="-50" width="100" height="100" fill="lightgoldenrodyellow"></rect>`;
        this.dimensions.x = 144;
        this.dimensions.y = 32;

        if (propagateUp) this.parent.update(true);
    }

    public toRootScript(): ScuffrRootScriptElement {
        throw new Error("Method not implemented.");
    }

    public getBackgroundModifier(): IScuffrBackgroundModifier {
        return this;
    }

    public getPath(size: Vec2, line: ScuffrBackgroundContentLine): string | null {
        // return null;
        return `a 4 4 0 0 1 -4 4 H 56 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v 16 a 4 4 0 0 0 4 4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H ${size.x + 4} a 4 4 0 0 1 4 4 `;
    }
}