
import { packageJSON, makeConfigs } from '../rollup-utils.mjs';

const name = packageJSON(import.meta.url).name;

export default makeConfigs(name)
