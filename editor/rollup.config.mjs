
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';

import { packageJSON, makeConfigs } from '../rollup-utils.mjs';
const name = packageJSON(import.meta.url).name;

export default makeConfigs(name, [
    svelte({
        preprocess: sveltePreprocess({ sourceMap: true }),
        compilerOptions: {
            dev: true
        }
    }),
    resolve({ dedupe: ['svelte'] }),
    css({output: "style.css"})
])
