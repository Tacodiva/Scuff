export interface MutVec2 {
    x: number;
    y: number;
}

export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

export namespace Vec2 {

    export function copy(vec: Vec2): MutVec2 {
        return { x: vec.x, y: vec.y };
    }
}