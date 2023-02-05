import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.ts',

	onwarn: function (message) {
		// Make rollup shut up about circular dependency 'issues'.
		if (message.code === 'CIRCULAR_DEPENDENCY') return;
		console.warn(message.toString());
	},

	output: {
		sourcemap: !production,
		format: 'amd',
		name: 'app',
		file: 'public/bundle/bundle.js',
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),

		resolve({ dedupe: ['svelte'] }),
		commonjs(),

		typescript(
			{
				tsconfig: "src/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production
			}
		),

		!production && livereload({ watch: ['public'] }),
	],
	watch: {
		clearScreen: false
	}
};