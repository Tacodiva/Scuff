import { ScuffrSvgScriptRoot } from "./svg/ScuffrSvgScriptRoot";
import { BlockInstance, BlockScriptRoot } from "../block";
import type { Vec2 } from "../utils/Vec2";
import type { ScuffrAttachmentPointList } from "./attachment-points/ScuffrAttachmentPointList";
import { ScuffrInteractionPanning } from "./interactions/ScuffrInteractionPanning";
import type { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";
import { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";
import type { ScuffrSvgBlock } from "./svg/ScuffrSvgBlock";
import type { ScuffrSvgBlockInstance } from "./svg/ScuffrSvgBlockInstance";
import EditorScrollbarSvg from "../editor/scrollbar/EditorScrollbarSvg.svelte";
import type { ScuffEditorScrollableAreaData } from "../editor/scrollbar/ScuffEditorScrollableArea";

export class ScuffrEditorScriptContainer extends ScuffrElementScriptContainer {
    public children: ScuffrSvgScriptRoot[];
    public parent: ScuffrEditorWorkspace;

    protected readonly _scrollContainer: SVGGElement;

    public readonly backgroundPattern: SVGPatternElement;
    public readonly backgroundRect: SVGRectElement;

    protected readonly backgroundSvgTranslation: SVGTransform;
    protected readonly backgroundSvgScale: SVGTransform;

    private _attachmentPoints: Set<ScuffrAttachmentPointList>;

    public constructor(workspace: ScuffrEditorWorkspace) {
        const dom = workspace.dom.appendChild(document.createElementNS(SVG_NS, "g"));
        const defs = dom.appendChild(document.createElementNS(SVG_NS, "defs"));
        const background = dom.appendChild(document.createElementNS(SVG_NS, "rect"));

        super(workspace, dom);
        this.parent = workspace;
        this.children = [];
        this._attachmentPoints = new Set();

        new this.parent.pane.BackgroundPattern({ target: defs });
        this.backgroundPattern = defs.querySelector(".scuff-workspace-background") as SVGPatternElement;
        this.backgroundPattern.id = "" + Math.floor(Math.random() * 1e16);

        this.backgroundRect = background;
        this.backgroundRect.setAttribute("width", "100%");
        this.backgroundRect.setAttribute("height", "100%");
        this.backgroundRect.style.fill = `url("#${this.backgroundPattern.id}")`;

        this.backgroundSvgScale = this.workspace.dom.createSVGTransform();
        this.backgroundPattern.patternTransform.baseVal.appendItem(this.backgroundSvgScale);
        this.backgroundSvgTranslation = this.workspace.dom.createSVGTransform();
        this.backgroundPattern.patternTransform.baseVal.appendItem(this.backgroundSvgTranslation);

        this.contentTranslation = { ...this.parent.pane.scripts.transformPosition };
        this.contentScale = this.parent.pane.scripts.transformScale;

        for (const script of this.parent.pane.scripts.scripts) {
            const rendered = new ScuffrSvgScriptRoot(this, script);
            rendered.updateAll();
            this.children.push(rendered);
        }
        this.updateScrollPane();

        this._scrollContainer = dom.appendChild(document.createElementNS(SVG_NS, "g"));
        this._scrollContainer.style.transform = "translateX(250px)";
        new EditorScrollbarSvg({ target: this._scrollContainer, props: { pane: this.scrollPane } })
    }

    public override renderScript(blocks: BlockInstance[], translation?: Vec2 | undefined): ScuffrSvgScriptRoot {
        const script = new BlockScriptRoot(blocks, translation);
        this.parent.pane.scripts.scripts.push(script); 
        const rendered = new ScuffrSvgScriptRoot(this, script);
        rendered.updateAll();
        this.children.push(rendered);
        return rendered;
    }

    public override createScript(blocks?: ScuffrSvgBlock[], translation?: Vec2): ScuffrSvgScriptRoot {
        const scriptBlocks = blocks?.map(block => (<ScuffrSvgBlockInstance>block).block);
        const script = new BlockScriptRoot(scriptBlocks, translation);
        this.parent.pane.scripts.scripts.push(script);
        const rendered = new ScuffrSvgScriptRoot(this, script, blocks);
        this.children.push(rendered);
        return rendered;
    }

    public override deleteScript(script: ScuffrSvgScriptRoot, deleteBlocks: boolean = true) {
        this.parent.pane.scripts.scripts.splice(this.parent.pane.scripts.scripts.indexOf(script.script), 1);
        this.children.splice(this.children.indexOf(script), 1);
        script.attachmentPoints.delete();
        script.dom.remove();
        if (deleteBlocks) for (const child of script.children)
            child.onAncestryChange(null);
    }

    public override getAttachmentPoints(): Iterable<ScuffrAttachmentPointList> {
        return this._attachmentPoints;
    }

    public override addAttachmentPoints(points: ScuffrAttachmentPointList): void {
        this._attachmentPoints.add(points);
    }

    public override deleteAttachmentPoints(points: ScuffrAttachmentPointList): void {
        this._attachmentPoints.delete(points);
    }

    public override onDrag(startPosition: Vec2): boolean {
        this.workspace.startInteraction(new ScuffrInteractionPanning(this, startPosition));
        return true;
    }

    public override onWheel(event: WheelEvent): boolean {
        if (event.ctrlKey) {
            const deltaY = event.deltaY > 0 ? 0.8 : 1.2;

            const newScale = this.contentScale * deltaY;

            const x = event.x - this.bounds.x;
            this.contentTranslation.x += x / newScale - x / this.contentScale;
            
            const y = event.y - this.bounds.y;
            this.contentTranslation.y += y / newScale - y / this.contentScale;
            
            this.contentScale = newScale;

            this.updateContentTransform();
            event.preventDefault();
        } else {
            let delta = -event.deltaY / this.contentScale;
            if (event.shiftKey) {
                this.contentTranslation.x += delta;
            } else {
                this.contentTranslation.y += delta;
            }
            this.updateContentTransform();
        }
        return true;
    }

    protected override updateContentTransformDOM(): void {
        super.updateContentTransformDOM();
        this.backgroundSvgScale.setScale(this.contentScale, this.contentScale);
        this.backgroundSvgTranslation.setTranslate(this.contentTranslation.x, this.contentTranslation.y);
    }

    protected override _setScrollPane(scroll: ScuffEditorScrollableAreaData): void {
        scroll.domSize.x -= 250;
        super._setScrollPane(scroll);
    }
}