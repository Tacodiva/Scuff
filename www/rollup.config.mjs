import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { production } from '../rollup-utils.mjs';
import resolve from '@rollup/plugin-node-resolve';
import css from "rollup-plugin-import-css";

export default [
    {
        input: 'src/index.ts',

        output: {
            sourcemap: !production,
            format: 'es',
            file: 'public/bundle/index.mjs'
        },
        plugins: [
            typescript(
                {
                    tsconfig: "./tsconfig.json",
                    sourceMap: !production,
                    inlineSources: !production,
                }
            ),
            resolve(),
            css({ output: "style.css" }),

            !production && livereload({ watch: ['public'] }),
            production && terser({ mangle: false }),
        ],
    }
]