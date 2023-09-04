import typescript from '@rollup/plugin-typescript';
import css from "rollup-plugin-import-css";
import terser from '@rollup/plugin-terser';
import { string } from "rollup-plugin-string";
import emitFiles from 'rollup-plugin-emit-files'
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import resolve from '@rollup/plugin-node-resolve';

import { packageJSON, makeConfigs } from '../rollup-utils.mjs';
const name = packageJSON(import.meta.url).name;

export default [
    {
        input: './virtual-machine/index.ts',
        output: {
            format: 'iife',
            name: "ScuffVM",
            file: './virtual-machine.js.txt',
            exports: "named"
        },
        plugins: [
            typescript(
                {
                    tsconfig: "./virtual-machine/tsconfig.json",
                }
            ),

            terser(),
        ]
    },
    ...makeConfigs(name, [
        svelte({
            preprocess: sveltePreprocess({ sourceMap: true }),
            compilerOptions: {
                dev: true
            }
        }),
        resolve({
            dedupe: ['svelte'],
            resolveOnly: ['svelte']
        }),
        emitFiles({
            src: "./lib",
            dest: "lib"
        }),

        string({ include: "./virtual-machine.js.txt" }),
    ],

        [
            '@scuff/core'
        ],

        {
            globals: {
                '@scuff/core': 'ScuffCore'
            }
        },

        [
            {
                moduleParsed(info) {
                    if (info.importedIds.includes("@scuff/editor")) {
                        throw new Error(`Module '${info.id}' can only import types from '@scuff/editor'.`);
                    }
                }
            },
        ])
]