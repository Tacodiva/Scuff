import { BlockSubscriptInput } from "./src/block/BlockSubscriptInput";
import { BlockScriptRoot } from "./src/block/BlockScriptRoot";
import Target from './src/Target';
import App from './svelte/App.svelte';
import Blocks from './scratch/blocks';
import type { ScuffExtension } from "./ScuffExtension";
import type { ScuffExtensionLoader } from "./api/ScuffExtensionLoader";

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

    main(): void;
}

export class ScuffCoreImpl implements ScuffCore {

    public readonly version: Version;

    private _extensions: Map<string, ScuffExtension>;
    private _extensionListeners: Map<string, ((ext: ScuffExtension) => void)[]> | null;

    public constructor(loaders: ScuffExtensionLoader[], ready: (core: ScuffCoreImpl) => void) {
        this.version = [0, 11];
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

    main() {
        const target = new Target();

        const script = new BlockScriptRoot([
            Blocks.event.flag_clicked.createInstance(),

            Blocks.control.if.createInstance({

                idk: Blocks.operator.equals.createInstance({
                    test: Blocks.operator.add.createInstance()
                }),
                testI: new BlockSubscriptInput([
                    Blocks.motion.move_steps.createInstance(),

                    Blocks.control.if.createInstance(),
                    Blocks.control.forever.createInstance()
                ])
            }),

            Blocks.motion.move_steps.createInstance({
                test: Blocks.operator.add.createInstance({
                    test: Blocks.operator.add.createInstance({
                        test: Blocks.operator.add.createInstance({
                            test: Blocks.operator.add.createInstance({
                                testII: Blocks.operator.equals.createInstance(),
                            }),
                        }),
                    }),
                    testII: Blocks.operator.add.createInstance(),
                }),
            }),
            Blocks.motion.move_steps.createInstance(),
            Blocks.motion.move_steps.createInstance(),
            Blocks.motion.move_steps.createInstance({
                test: Blocks.operator.add.createInstance({}),
            }),
            Blocks.motion.move_steps.createInstance(),
            Blocks.motion.move_steps.createInstance({
                test: Blocks.operator.add.createInstance({}),
            }),
        ]);

        script.translation = { x: 100, y: 100 };
        target.blockScripts.scripts.push(script);
        target.blockScripts.transformScale = 1.5;
        target.blockScripts.transformPosition = { x: 0, y: 150 };

        new App({
            target: document.body,
            props: {
                scripts: target.blockScripts
            }
        });
    }
}