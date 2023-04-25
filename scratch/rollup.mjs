import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { string } from "rollup-plugin-string";
import { onwarn, production } from '../rollup-utils.mjs';
import emitFiles from 'rollup-plugin-emit-files'
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'scratch/virtual-machine/index.ts',
        output: {
            format: 'iife',
            name: "ScuffVM",
            file: 'scratch/virtual-machine.js.txt',
            exports: "named"
        },
        plugins: [
            typescript(
                {
                    tsconfig: "scratch/virtual-machine/tsconfig.json",
                }
            ),

            production && terser(),
        ]
    },
    {
        input: 'scratch/scuff-scratch/index.ts',

        external: ['scuff'],
        output: {
            sourcemap: !production,
            format: 'es',
            file: 'public/bundle/scratch/scuff-scratch.mjs',
        },
        plugins: [

            emitFiles({
                src: "scratch/lib",
                dest: "lib"
            }),

            css({
                output: 'scuff-scratch.css'
            }),

            string({
                include: "scratch/virtual-machine.js.txt"
            }),

            nodeResolve(),

            typescript(
                {
                    tsconfig: "scratch/scuff-scratch/tsconfig.json",
                    sourceMap: !production,
                    inlineSources: !production,

                    paths: {
                        "scuff": [
                            "../../public/bundle/core/scuff.d.ts"
                        ]
                    }
                }
            ),

            production && terser({ mangle: false }),
        ],
        onwarn
    },
    {
        input: 'scratch/scuff-scratch/index.ts',

        external: [/\.css$/, 'scuff'],
        output: [
            {
                file: "public/bundle/scratch/scuff-scratch.d.ts",
                format: "es"
            }
        ],
        plugins: [
            dts()
        ]
    }
]