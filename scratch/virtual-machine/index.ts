import { ScuffVMConfig } from "./ScuffVMConfig";
import { ScuffVMIFrame } from "./ScuffVMIFrame";
import loadLLK from "./llk/load";

export type ScuffVMTypeMap = {
    "IFrame": ScuffVMIFrame
};

export async function createScuffVM<T extends keyof ScuffVMTypeMap>(config: ScuffVMConfig & { type: T }): Promise<ScuffVMTypeMap[T]> {
    await loadLLK(config);
    
    switch (config.type) {
        case "IFrame":
            return ScuffVMIFrame.create(config);
        default:
            throw new Error(`Unknown VM '${config.type}'`);
    }
};

export default createScuffVM;

(<any>window).createScuffVM = createScuffVM;