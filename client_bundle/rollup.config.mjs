import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'client_bundle/main.ts',

	onwarn: function (message) {
		// Make rollup shut up about circular dependency 'issues'.
		if (message.code === 'CIRCULAR_DEPENDENCY') return;
		console.warn(message.toString());
	},

	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'build/client/bundle.js',
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({ dedupe: ['svelte'] }),
		commonjs(),

		typescript(
			{
				tsconfig: "client_bundle/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production
			}
		),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// !production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload({ watch: ['client_www', 'build/client'] }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		// production && terser()
	],
	watch: {
		clearScreen: false
	}
};