import type { ScuffConfig } from "./api/ScuffConfig";
import type { ScuffExtensionLoader } from "./api/ScuffExtensionLoader";
import { ScuffCoreImpl, type ScuffCore } from "./ScuffCore";

export default async function (config: ScuffConfig): Promise<ScuffCore> {
    config.path = new URL(config.path, document.baseURI).href;

    let extensionLoaders: ScuffExtensionLoader[] = [];
    {
        let loadingExts: Promise<ScuffExtensionLoader>[] = [];
        for (const ext of config.extensions) {
            if (typeof ext === "string") {
                loadingExts.push(import(new URL(ext, document.baseURI).href).then(module => module.default));
            } else {
                if (ext.path)
                    ext.loader.path = ext.path;
                if (!ext.loader.path)
                    throw new Error(); // No path provided
                extensionLoaders.push(ext.loader);
            }
        }
        extensionLoaders.push(...(await Promise.all(loadingExts)));
    }

    function loadCSS(href: string): Promise<void> {
        return new Promise((resolve, reject) => {
            var link = document.createElement('link');
            link.onload = resolve as any;
            link.onerror = err => {
                console.error(`Fatal error while loading Scuff. Error loading stylesheet '${href}'.`);
                reject();
            }
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", href);
            document.head.appendChild(link);
        });
    }

    let loadPromises: Promise<unknown>[] = [];

    loadPromises.push(loadCSS(new URL("scuff.css", config.path).href));

    for (const loader of extensionLoaders) {
        loader.path = new URL(loader.path!, document.baseURI).href;
        if (loader.styles) for (const style of loader.styles) {
            loadPromises.push(loadCSS(new URL(style, loader.path).href));
        }
    }

    await Promise.all(loadPromises);

    return new Promise(resolve => new ScuffCoreImpl(extensionLoaders, resolve));
}