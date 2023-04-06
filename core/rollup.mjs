import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { onwarn, production } from '../rollup-utils.mjs';

export default [{
    input: 'core/src/index.ts',

    output: {
        sourcemap: !production,
        format: 'es',
        file: 'public/bundle/core/scuff.mjs',
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                dev: true
            }
        }),
        css({
            output: 'scuff.css'
        }),

        resolve({ dedupe: ['svelte'] }),

        typescript(
            {
                tsconfig: "core/tsconfig.json",
                sourceMap: !production,
                inlineSources: !production
            }
        ),

        production && terser({ mangle: false }),
    ],
    onwarn
},
{
    input: 'core/src/index.ts',
    external: /\.css$/,
    output: [
        {
            file: "public/bundle/core/scuff.d.ts",
            format: "es"
        }
    ],
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                dev: true
            }
        }),
        dts()
    ]
}
]