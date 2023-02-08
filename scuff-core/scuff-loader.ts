import { type ScuffCore, ScuffCoreImpl } from "./ScuffCore";
import type { ScuffConfig } from "./api/ScuffConfig";
import type { ScuffExtensionLoader } from "./api";

export async function load(config: ScuffConfig): Promise<ScuffCore> {
	config.path = new URL(config.path, document.baseURI).href;

	let extensionLoaders: ScuffExtensionLoader[] = [];
	{
		let loadingExts: Promise<ScuffExtensionLoader>[] = [];
		for (const ext of config.extensions) {
			if (typeof ext === "string") {
				loadingExts.push(import(new URL(ext, document.baseURI).href).then(module => {
					const extLoader: ScuffExtensionLoader = module.default;
					if (!extLoader.path) extLoader.path = new URL(ext, document.baseURI).href;
					return extLoader;
				}));
			} else {
				extensionLoaders.push(ext);
			}
		}
		extensionLoaders.push(...(await Promise.all(loadingExts)));
	}

	let loadPromises: Promise<unknown>[] = [];

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

	loadPromises.push(loadCSS(new URL("scuff-core.css", config.path).href));

	for (const ext of extensionLoaders) {
		if (ext.styles) for (const style of ext.styles) {
			loadPromises.push(loadCSS(new URL(style, ext.path).href));
		}
	}

	await Promise.all(loadPromises);

	return new Promise(resolve => new ScuffCoreImpl(extensionLoaders, resolve));
}