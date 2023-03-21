import type { Vec2 } from './Vec2';

export interface Bounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface MutBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export namespace Bounds {
    export const Zero: Bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    export function dimensions(bounds: Bounds): Vec2 {
        return { x: bounds.width, y: bounds.height };
    }

    export function equal(a: Bounds, b: Bounds): boolean {
        return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
    }

    export function from(pos: Vec2, dim: Vec2): MutBounds {
        return { ...pos, width: dim.x, height: dim.y };
    }
}