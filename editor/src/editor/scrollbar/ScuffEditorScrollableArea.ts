import type { Vec2 } from "@scuff/core";
import type { Writable } from "svelte/store";

export type ScuffEditorScrollableAreaData = {
    contentTopLeft: Vec2;
    contentBottomRight: Vec2;
    viewportTopLeft: Vec2;
    viewportBottomRight: Vec2;
    domSize: Vec2;
    enforceBounds: boolean;
};

export type ScuffEditorScrollableArea = Writable<ScuffEditorScrollableAreaData>;