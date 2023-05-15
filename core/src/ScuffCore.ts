
import type { ScuffModule } from "./api/ScuffModule";

/**  An array of two number, the major version followed by the minor version. */
export type Version = [number, number];

/**
 * The main class used by extension to add and modify content in Scuff.
 */
export interface ScuffCore {

    /**
     * The current version of ScuffCore.
     */
    readonly version: Version;
    /**
     * @returns A boolean indicating if there is a known module with the given ID.
     */
    hasModule(id: string): boolean;
    /**
     * Gets and returns a loaded module with the given ID. If the module is unknown or
     * the module is not loaded, an error is thrown.
     */
    getModule(id: string): ScuffModule;
    /**
     * Gets and returns a loaded or unloaded module with a given ID. If the module is
     * unknown, an error is thrown.
     */
    getModuleAsync(id: string): Promise<ScuffModule>;
}

export class ScuffCoreImpl implements ScuffCore {

    public static readonly version: Version = [0, 23];
    public readonly version: Version;

    private _modules: Map<string, ScuffModule>;
    private _moduleListeners: Map<string, ((ext: ScuffModule) => void)[]> | null;

    public constructor(modules: ScuffModule[], ready: (core: ScuffCoreImpl) => void) {
        this.version = ScuffCoreImpl.version;
        this._modules = new Map();
        let modulePromises = this._moduleListeners = new Map();

        for (const module of modules) {
            if (this._moduleListeners.has(module.scuffModuleInfo.id))
                throw new Error();
            this._moduleListeners.set(module.scuffModuleInfo.id, []);
        }

        const registerModule = (module: ScuffModule) => {
            this._modules.set(module.scuffModuleInfo.id, module);
            for (const promise of modulePromises.get(module.scuffModuleInfo.id))
                promise(module);
        }

        const promises: Promise<void>[] = [];

        for (const module of modules) {
            let loadResult = module.scuffModuleInfo.load(this);

            if (loadResult instanceof Promise) {
                promises.push(loadResult.then(() => registerModule(module)));
            } else {
                registerModule(module);
            }
        }

        Promise.all(promises).then(() => {
            ready(this);
        });
    }

    public hasModule(id: string): boolean {
        return this._modules.has(id) || !!this._moduleListeners?.has(id);
    }

    public getModule(id: string): ScuffModule {
        const ext = this._modules.get(id);
        if (!ext)
            if (this.hasModule(id))
                throw new Error(); // Extension hasn't loaded yet
            else
                throw new Error(); // Extension not found
        return ext;
    }

    public getModuleAsync(id: string): Promise<ScuffModule> {
        return new Promise(resolve => {
            let extension = this._modules.get(id);
            if (extension) return resolve(extension);
            let listeners = this._moduleListeners?.get(id);
            if (!listeners)
                throw new Error() // Extension not found
            listeners?.push(resolve);
        });
    }
}