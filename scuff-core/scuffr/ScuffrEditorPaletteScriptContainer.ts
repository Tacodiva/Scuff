import { BlockScriptRoot, BlockType } from "../block";
import type { Bounds } from "../utils/Bounds";
import type { Vec2 } from "../utils/Vec2";
import { ScuffrInteractionPanning } from "./interactions/ScuffrInteractionPanning";
import { ScuffrBlockPaletteItemBlock } from "./palette/ScuffrBlockPaletteItemBlock";
import type { ScuffrEditorWorkspace } from "./ScuffrEditorWorkspace";
import { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";
import { ScuffrSvgScriptPalette } from "./svg/ScuffrSvgScriptPalette";
import EditorScrollbarSvg from "../editor/scrollbar/EditorScrollbarSvg.svelte";
import type { ScuffrEditorPalette } from "./ScuffrEditorPalette";

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

        this.updateScrollPane();
        new EditorScrollbarSvg({ target: dom, props: { pane: this.scrollPane } })
    }

    public createPaletteBlock(type: BlockType, translation: Vec2): ScuffrSvgScriptPalette {
        const script = new BlockScriptRoot([type.createInstance()], translation);
        const rendered = new ScuffrSvgScriptPalette(this, script, this.parent.parent.scriptContainer);
        rendered.updateAll();
        this.children.push(rendered);
        // this.updateScrollPane();
        return rendered;
    }

    public override setBounds(bounds: Bounds): void {
        this.background.style.width = bounds.width + "px";
        this.background.style.height = bounds.height + "px";        
        super.setBounds(bounds);
    }

    public override onDrag(startPosition: Vec2): boolean {
        this.workspace.startInteraction(new ScuffrInteractionPanning(this, startPosition));
        return true;
    }

    public override onWheel(event: WheelEvent): boolean {
        let delta = -event.deltaY / this.contentScale;
        this.contentTranslation.y += delta;
        this.updateContentTransform();
        return true;
    }

    public override updateContentTransform(): void {
        if (this.contentTranslation.y > 0)
            this.contentTranslation.y = 0;
        this._scrollTopLeft.x = 0;
        this._scrollTopLeft.y = 0;
        this._scrollBottomRight.x = 0;
        this.contentTranslation.x = 0;
        this.contentScale = 0.675;
        super.updateContentTransform();
    }
}