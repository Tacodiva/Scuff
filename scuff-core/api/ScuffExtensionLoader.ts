import type { ScuffCore } from "../ScuffCore";
import type { ScuffExtension } from "../ScuffExtension";

/**
 * The type of the defualt export of extension modules.
 */
export interface ScuffExtensionLoader {
    /**
     * This ID of this extension.
     */
    readonly id: string;

    /**
     * The directory to load the resources requested by this addon from.
     */
    path?: string;

    /**
     * A list of paths to CSS files to load with this extension.
     */
    readonly styles?: string[];

    /**
     * Initalizes this extension and creates the extension object that is 
     * exposed to other addons.
     * @param core The core object shared between all extensions.
     */
    load(core: ScuffCore): Promise<ScuffExtension> | ScuffExtension;
}
