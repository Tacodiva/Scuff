import type { Writable } from "svelte/store";
import type { Vec2 } from "../../utils/Vec2";

export type ScrollablePane = Writable<{
    clientSize: Vec2;
    viewportSize: Vec2;
    contentTopLeft: Vec2;
    contentBottomRight: Vec2;
    scroll: Vec2;
}>;