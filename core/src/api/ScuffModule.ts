import { ScuffCore } from "../ScuffCore";

export interface ScuffModule {
    readonly scuffModuleInfo: ScuffModuleInfo;
}

export interface ScuffModuleInfo {
    /** The ID of this module. */
    readonly id: string;
    /** Load this module. */
    load(core: ScuffCore): void | Promise<void>;
}
