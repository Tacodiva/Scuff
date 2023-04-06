import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { onwarn, production } from './rollup-utils.mjs';

import scuff_core from './core/rollup.mjs';
import scuff_scratch from './scratch/rollup.mjs';

export default [
	...scuff_core,
	...scuff_scratch,
	{
		input: 'src/index.ts',

		external: ['scuff', 'scuff-scratch'],
		output: {
			sourcemap: !production,
			format: 'es',
			file: 'public/bundle/index.mjs'
		},
		plugins: [
			typescript(
				{
					tsconfig: "src/tsconfig.json",
					sourceMap: !production,
					inlineSources: !production,

					paths: {
						"scuff": [
							"../public/bundle/core/scuff.d.ts"
						],
						"scuff-scratch": [
							"../public/bundle/scratch/scuff-scratch.d.ts"
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
