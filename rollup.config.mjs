import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const production = !process.env.ROLLUP_WATCH;

function onwarn(message) {
	// Make rollup shut up about circular dependency 'issues'.
	if (message.code === 'CIRCULAR_DEPENDENCY') return;
	console.warn(message.toString());
};

export default [{
	input: 'scuff-core/index.ts',

	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/scuff-core/scuff-core.mjs',
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				dev: !production
			}
		}),
		css({
			output: 'scuff-core.css'
		}),

		resolve({ dedupe: ['svelte'] }),

		typescript(
			{
				tsconfig: "scuff-core/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production
			}
		),

		production && terser({ mangle: false }),
	],
	onwarn
},
{
	input: 'scuff-core/index.ts',
	external: /\.css$/,
	output: [
		{
			file: "public/lib/scuff-core/scuff-core.d.ts",
			format: "es"
		}
	],
	plugins: [
		dts()
	]
},
{
	input: 'scuff-scratch/index.ts',

	external: ['scuff'],
	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/scuff-scratch/scuff-scratch.mjs',
	},
	plugins: [
		css({
			output: 'scuff-scratch.css'
		}),

		typescript(
			{
				tsconfig: "scuff-scratch/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production,

				paths: {
					"scuff": [
						"../public/lib/scuff-core/scuff-core.d.ts"
					]
				}
			}
		),

		production && terser({ mangle: false }),
	],
	onwarn
},
{
	input: 'scuff-scratch/index.ts',

	external: [/\.css$/, 'scuff'],
	output: [
		{
			file: "public/lib/scuff-scratch/scuff-scratch.d.ts",
			format: "es"
		}
	],
	plugins: [
		dts()
	]
},
{
	input: 'src/index.ts',

	external: ['scuff', 'scuff-scratch'],
	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/index.js'
	},
	plugins: [
		typescript(
			{
				tsconfig: "src/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production,

				paths: {
					"scuff": [
						"../public/lib/scuff-core/scuff-core.d.ts"
					],
					"scuff-scratch": [
						"../public/lib/scuff-scratch/scuff-scratch.d.ts"
					]
				}
			}
		),

		!production && livereload({ watch: ['public'] }),
		production && terser({ mangle: false }),
	],
	onwarn
}
];
