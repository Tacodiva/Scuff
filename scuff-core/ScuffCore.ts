
import type { ScuffExtension } from "./api/ScuffExtension";
import type { ScuffExtensionLoader } from "./api/ScuffExtensionLoader";
import Target from "./Target";
import type { BlockScriptRoot } from "./block/BlockScriptRoot";
import type { ScuffrWorkspace } from "./scuffr";
import type { SvelteComponent } from "svelte";
import { ScuffEditor } from "./editor/ScuffEditor";
import { ScuffEditorSveltePane } from "./editor/ScuffEditorSveltePane";
import ScuffEditorDefautComponent from "./editor/ScuffEditorDefautComponent.svelte";
import { ScuffEditorPaneSplit } from "./editor/ScuffEditorSplitPane";
import ScuffEditorInfoComponent from "./editor/ScuffEditorInfoComponent.svelte";
import { ScuffrEditorPane } from "./scuffr/ScuffrEditorPane";
import WorkspaceBackgroundCompnent from "./editor/WorkspaceBackgroundCompnent.svelte";
import WorkspaceDefinitionComponent from './editor/WorkspaceDefinitionComponent.svelte'
import type { ScuffrBlockPalette } from "./scuffr/palette/ScuffrBlockPalette";

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

    main(script: BlockScriptRoot, palette: ScuffrBlockPalette): void;
}

export class ScuffCoreImpl implements ScuffCore {

    public static readonly version: Version = [0, 21];
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

    public main(script: BlockScriptRoot, palette: ScuffrBlockPalette): void {
        document.body.classList.add("scuff-theme-default");
        if (location.href.includes("light"))
            document.body.classList.add("scuff-theme-light");
        if (location.href.includes("contrast"))
            document.body.classList.add("scuff-theme-contrast-blocks");
        if (location.href.includes("bold"))
            document.body.classList.add("scuff-theme-bold");
        if (location.href.includes("neon"))
            document.body.classList.add("scuff-theme-neon");

        const targetL = new Target();
        targetL.blockScripts.scripts.push(script.clone());
        targetL.blockScripts.transformScale = 1.5;
        targetL.blockScripts.transformPosition = {x: 200, y: 75};

        const targetR = new Target();
        targetR.blockScripts.scripts.push(script);
        targetR.blockScripts.transformScale = 1.5;
        targetR.blockScripts.transformPosition = {x: 200, y: 75};

        new WorkspaceDefinitionComponent({ target: document.body });

        new ScuffEditor(document.body,
            ScuffEditorPaneSplit.createHorizontal(
                ScuffEditorPaneSplit.createVertical(
                    ScuffEditorSveltePane.create([ScuffEditorInfoComponent]),
                    ScuffrEditorPane.create(targetL.blockScripts, WorkspaceBackgroundCompnent, palette),
                    0.3
                ),
                ScuffrEditorPane.create(targetR.blockScripts, WorkspaceBackgroundCompnent, palette)
            )
        );
    }
}