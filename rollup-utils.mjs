import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export const production = !process.env.ROLLUP_WATCH;

export function onwarn(message) {
	// Make rollup shut up about circular dependency 'issues'.
	if (message.code === 'CIRCULAR_DEPENDENCY') return;
	console.warn(message.toString());
};

export function packageJSON(importMetaURL) {
	return JSON.parse(fs.readFileSync(new URL("./package.json", importMetaURL)));
}

export function makeConfigs(name, plugins = [], external = undefined, output = {}, postPlugins = []) {
	return [
		{
			input: ['src/index.ts'], external,
			output: [{ dir: 'dist/esm', format: 'esm', entryFileNames: '[name].mjs', sourcemap: true, ...output }],
			plugins: [...plugins, typescript({ tsconfig: './tsconfig.json', outDir: 'dist/esm', sourceMap: true, inlineSources: true }), ...postPlugins]
		},
		{
			input: ['src/index.ts'], external,
			output: [{ dir: 'dist/cjs', format: 'cjs', entryFileNames: '[name].js', sourcemap: true, exports: "named", ...output }],
			plugins: [...plugins, typescript({ tsconfig: './tsconfig.json', outDir: 'dist/cjs', sourceMap: true, inlineSources: true }), ...postPlugins],
		},
		{
			input: ['src/index.ts'], external,
			output: [{ dir: 'dist/umd', format: 'umd', entryFileNames: '[name].js', name, sourcemap: true, exports: "named", ...output }],
			plugins: [...plugins, typescript({ tsconfig: './tsconfig.json', outDir: 'dist/umd', sourceMap: true, inlineSources: true }), terser(), ...postPlugins],
		},
		{
			input: ['src/index.ts'], external,
			output: [{ dir: 'dist/amd', format: 'amd', entryFileNames: '[name].js', name, sourcemap: true, exports: "named", ...output }],
			plugins: [...plugins, typescript({ tsconfig: './tsconfig.json', outDir: 'dist/amd', sourceMap: true, inlineSources: true }), terser(), ...postPlugins],
		},
	]
}