import { ScuffVMTypeMap } from ".";

export interface ScuffVMConfigBase {
    type: keyof ScuffVMTypeMap;

    libs: {
        scratchAudio: string,
        scratchRender: string
    }
}

export interface ScuffVMConfigIFrame extends ScuffVMConfigBase {
    type: "IFrame",
}

export type ScuffVMConfig = ScuffVMConfigIFrame;