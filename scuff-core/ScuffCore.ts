
import type { ScuffExtension } from "./api/ScuffExtension";
import type { ScuffExtensionLoader } from "./api/ScuffExtensionLoader";
import Target from "./Target";
import App from './editor/EditorComponent.svelte';
import type { BlockScriptRoot } from "./block/BlockScriptRoot";

type Version = [number, number];

/**
 * The main class used by extension to add and modify content in Scuff.
 */
export interface ScuffCore {

    /**
     * The current version of ScuffCore. Is an array of two number, the major version followed
     * by the minor version.
     */
    readonly version: Version;
    /**
     * @returns A boolean indicating if there is a known extension with the given ID.
     */
    hasExtension(id: string): boolean;
    /**
     * Get and returns a loaded extension with the given ID. If the extension is unknown or
     * the extension is not loaded, an error is thrown.
     */
    getExtension(id: string): ScuffExtension;
    /**
     * Get and returns a loaded or unloaded extension with a given ID. If the extension is
     * unknown, an error is thrown.
     */
    getExtensionAsync(id: string): Promise<ScuffExtension>;

    main(script: BlockScriptRoot): void;
}

export class ScuffCoreImpl implements ScuffCore {

    public static readonly version: Version = [0, 14];
    public readonly version: Version;

    private _extensions: Map<string, ScuffExtension>;
    private _extensionListeners: Map<string, ((ext: ScuffExtension) => void)[]> | null;

    public constructor(loaders: ScuffExtensionLoader[], ready: (core: ScuffCoreImpl) => void) {
        this.version = ScuffCoreImpl.version;
        this._extensions = new Map();
        let extensionPromises = this._extensionListeners = new Map();

        for (const loader of loaders) {
            if (this._extensionListeners.has(loader.id))
                throw new Error();
            this._extensionListeners.set(loader.id, []);
        }

        const registerExtension = (id: string, ext: ScuffExtension) => {
            this._extensions.set(id, ext);
            for (const promise of extensionPromises.get(id))
                promise(ext);
        }

        const promises: Promise<[string, ScuffExtension]>[] = [];

        for (const loader of loaders) {
            let loadResult = loader.load(this);

            if (loadResult instanceof Promise) {
                promises.push(loadResult.then(result => [loader.id, result]));
            } else {
                registerExtension(loader.id, loadResult);
            }
        }

        Promise.all(promises).then(resolved => {
            for (const result of resolved)
                registerExtension(result[0], result[1]);
            ready(this);
        });
    }

    public hasExtension(id: string): boolean {
        return this._extensions.has(id) || !!this._extensionListeners?.has(id);
    }

    public getExtension(id: string): ScuffExtension {
        const ext = this._extensions.get(id);
        if (!ext)
            if (this.hasExtension(id))
                throw new Error(); // Extension hasn't loaded yet
            else
                throw new Error(); // Extension not found
        return ext;
    }

    public getExtensionAsync(id: string): Promise<ScuffExtension> {
        return new Promise(resolve => {
            let extension = this._extensions.get(id);
            if (extension) return resolve(extension);
            let listeners = this._extensionListeners?.get(id);
            if (!listeners)
                throw new Error() // Extension not found
            listeners?.push(resolve);
        });
    }

    public main(script: BlockScriptRoot): void {
        const target = new Target();


        // for (let x = 0; x < 80; x++) {
        //     for (let y = 0; y < 240; y++) {
        const clone = script.clone();
        // clone.translation = { x: x * 240, y: y * 80 };
        target.blockScripts.scripts.push(clone);
        //     }
        // }

        target.blockScripts.transformScale = 1.5;
        // target.blockScripts.transformPosition = { x: 0, y: 150 };

        new App({
            target: document.body,
            props: {
                scripts: target.blockScripts
            }
        });
    }
}