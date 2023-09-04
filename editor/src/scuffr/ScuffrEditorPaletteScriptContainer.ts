import { BlockScriptRoot, BlockType } from "../block";
import { Bounds } from "../utils/Bounds";
import type { Vec2 } from "@scuff/core";
import { ScuffrInteractionPanning } from "./interactions/ScuffrInteractionPanning";
import { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";
import { ScuffrSvgScriptPalette } from "./svg/ScuffrSvgScriptPalette";
import EditorScrollbarSvg from "../editor/scrollbar/EditorScrollbarSvg.svelte";
import type { ScuffrEditorPalette } from "./ScuffrEditorPalette";
import type { ScuffEditorScrollableAreaData } from "../editor/scrollbar/ScuffEditorScrollableArea";

export class ScuffrEditorPaletteScriptContainer extends ScuffrElementScriptContainer {
    public children: ScuffrSvgScriptPalette[];
    public readonly parent: ScuffrEditorPalette;

    public readonly background: SVGRectElement;

    public constructor(parent: ScuffrEditorPalette) {
        const dom = parent.dom.appendChild(document.createElementNS(SVG_NS, "g"));
        const defs = dom.appendChild(document.createElementNS(SVG_NS, "defs"));
        const background = dom.appendChild(document.createElementNS(SVG_NS, "rect"));

        super(parent.workspace, dom);

        this.parent = parent;
        new this.parent.parent.pane.BackgroundPattern({ target: defs });
        this.children = [];

        this.background = background;
        this.background.classList.add("scuff-palette-background");

        this._scrollEnforceBounds = true;
        this.updateScrollPane();
        new EditorScrollbarSvg({ target: dom, props: { pane: this.scrollPane } })
    }

    public appendPaletteBlock(type: BlockType, translation: Vec2): ScuffrSvgScriptPalette {
        const script = new BlockScriptRoot([type.createInstance()], translation);
        const rendered = new ScuffrSvgScriptPalette(this, script, this.parent.parent.scriptContainer);
        rendered.updateAll();
        this.children.push(rendered);
        return rendered;
    }

    public override setBounds(bounds: Bounds): void {
        this.background.style.width = bounds.width + "px";
        this.background.style.height = bounds.height + "px";
        super.setBounds(bounds);
    }

    public override onDrag(startPosition: Vec2): boolean {
        new ScuffrInteractionPanning(this, startPosition).start();
        return true;
    }

    public override onWheel(event: WheelEvent): boolean {
        let delta = -event.deltaY / this.contentScale;
        this.contentTranslation.y += delta;
        this.updateContentTransform();
        return true;
    }

    public override updateContentTransform(): void {
        this.contentScale = 0.675;
        super.updateContentTransform();
    }

    protected override updateContentTransformDOM(): void {
        super.updateContentTransformDOM();
        if (this.parent.elementContainer)
            this.parent.elementContainer.updateContentTransformDOM();
    }
    protected override _getContentBounds(): Bounds {
        let bounds = Bounds.copy(super._getContentBounds());
        if (this.parent.elementContainer) {
            const otherBounds = this.parent.elementContainer.dom.getBoundingClientRect();
            bounds = Bounds.smallestContaining(bounds, otherBounds);
        }
        bounds.x = 0;
        bounds.y = 0;
        bounds.height += 25;
        return bounds;
    }
}