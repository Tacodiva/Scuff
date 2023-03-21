import type { SvelteComponent } from "svelte";
import type { Vec2 } from "../utils/Vec2";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";

type SvelteComponentInfo<T extends SvelteComponent> = readonly [
    Component: new (_: { target: Element, props?: any }) => T,
    props?: any
];

export class ScuffEditorSveltePane<T extends SvelteComponent> extends ScuffEditorPane {
    public static create(info: SvelteComponentInfo<SvelteComponent>, minSize?: Vec2): ScuffEditorPaneFactory {
        return pane => new ScuffEditorSveltePane(pane, info, minSize);
    }

    public readonly component: T;

    private constructor(pane: ScuffEditorPaneInfo, [Component, props]: SvelteComponentInfo<T>, minSize?: Vec2) {
        super(pane);
        this.component = new Component({ target: this.target, props });
        this._minSize = minSize ?? { x: 100, y: 100 };
    }
}