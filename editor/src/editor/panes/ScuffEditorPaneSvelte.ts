import type { SvelteComponent } from "svelte";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";
import type { Vec2 } from "@scuff/core";

type SvelteComponentInfo<T extends SvelteComponent> = readonly [
    Component: new (_: { target: Element, props?: any }) => T,
    props?: any
];

export class ScuffEditorPaneSvelte<T extends SvelteComponent> extends ScuffEditorPane {
    public static create(info: SvelteComponentInfo<SvelteComponent>, minSize?: Vec2): ScuffEditorPaneFactory {
        return pane => new ScuffEditorPaneSvelte(pane, info, minSize);
    }

    public readonly component: T;

    private constructor(pane: ScuffEditorPaneInfo, [Component, props]: SvelteComponentInfo<T>, minSize?: Vec2) {
        super(pane);
        this.component = new Component({ target: this.target, props });
        this._minSize = minSize ?? { x: 100, y: 100 };
    }
}