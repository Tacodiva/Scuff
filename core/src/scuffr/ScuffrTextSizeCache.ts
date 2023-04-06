import type { Vec2 } from "../utils/Vec2";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";

export class ScuffrTextSizeCache {
    private static readonly _maxCacheSize = 5000;
    private readonly _svgTextStagingElement: SVGElement;
    private readonly _cache: Map<string, Vec2>;

    public constructor(workspace: ScuffrWorkspace) {
        this._svgTextStagingElement = workspace.dom
            .appendChild(document.createElementNS(SVG_NS, "g"))
            .appendChild(document.createElementNS(SVG_NS, "text"));
        this._svgTextStagingElement.classList.add("scuff-block-text");
        this._cache = new Map();
    }

    public getTextDimensions(text: string, node?: Text): Vec2 {
        const entry = this._cache.get(text);
        if (entry) return entry;
        if (!node) node = document.createTextNode(text);
        this._svgTextStagingElement.appendChild(node);
        const clientRect = this._svgTextStagingElement.getBoundingClientRect();
        const bounds = { x: clientRect.width, y: clientRect.height };
        this._cache.set(text, bounds);
        if (this._cache.size > ScuffrTextSizeCache._maxCacheSize)
            this._cache.delete(this._cache.keys().next().value);
        return bounds;
    }
}