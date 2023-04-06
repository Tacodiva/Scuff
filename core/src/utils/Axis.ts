import type { Vec2 } from "./Vec2";

export type Axis = "x" | "y";
export type AxisInfo = typeof Axis.X | typeof Axis.Y;

export namespace Axis {
    export const X = {
        name: "x",
        dim: "width",
        dir: "h",

        side_pos: "right",
        side_neg: "left"
    } as const;

    export const Y = {
        name: "y",
        dim: "height",
        dir: "v",

        side_pos: "bottom",
        side_neg: "top"
    } as const;

    export function getInfo(axis: Axis): AxisInfo {
        if (axis === "x") return X;
        return Y;
    }

    export function isX(axis: Axis | AxisInfo): boolean {
        return axis === "x" || axis === X;
    }

    export function isY(axis: Axis | AxisInfo): boolean {
        return axis === "y" || axis === Y;
    }

    export function getCross(axis: Axis | AxisInfo): Axis {
        if (isX(axis)) return "y";
        return "x";
    }

    export function getCrossInfo(axis: Axis | AxisInfo): AxisInfo {
        if (isX(axis)) return Y;
        return X;
    }

    export function vector(axis: Axis | AxisInfo, parallel: number, cross: number): Vec2 {
        if (isX(axis)) return { x: parallel, y: cross };
        return { x: cross, y: parallel };
    }
}