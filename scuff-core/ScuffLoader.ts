import { ScuffCore } from "./ScuffCore";
import type { ScuffConfig } from "./api/ScuffConfig";
import type { ScuffExtension } from "./api";

export const ScuffLoader = {

	async load(config: ScuffConfig): Promise<ScuffCore> {

		let extensions: ScuffExtension[] = [];

		{
			let loadingExts: Promise<ScuffExtension>[] = [];
			for (const ext of config.extensions) {
				if (typeof ext === "string") {
					loadingExts.push(new Promise((resolve, err) => {
						requirejs([ext], resolve, err);
					}));
				} else {
					extensions.push(ext);
				}
			}
			extensions.push(...(await Promise.all(loadingExts)));
		}


		for (const ext of extensions) {
			ext.init(ScuffCore);
		}

		return ScuffCore;
	}
}

export type ScuffLoader = typeof ScuffLoader;


const monaco = new Promise<MonacoAPI>((resolve, reject) => {
	requirejs.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });

	requirejs(["vs/editor/editor.main"], () => {
		resolve(<MonacoAPI>window["monaco" as keyof Window]);
	}, (err: any) => {
		reject(err);
	})
});

export default monaco;