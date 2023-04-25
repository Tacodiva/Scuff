import { ScratchInputTypeDropdownRound, ScratchInputTypeDropdownSquare } from "../block/input-types";

export const OptionsEffect = ScratchInputTypeDropdownSquare.createOptions({
    COLOR: "color",
    FISHEYE: "fisheye",
    WHIRL: "whirl",
    PIXELATE: "pixelate",
    MOSAIC: "mosaic",
    BRIGHTNESS: "brightness",
    GHOST: "ghost",
} as const);

export const OptionsKey = ScratchInputTypeDropdownRound.createOptions({
    space: "space",
    upArrow: "up arrow",
    downArrow: "down arrow",
    rightArrow: "right arrow",
    leftArrow: "left arrow",
    any: "any",
    a: "a",
    b: "b",
    c: "c",
    d: "d",
    e: "e",
    f: "f",
} as const);
