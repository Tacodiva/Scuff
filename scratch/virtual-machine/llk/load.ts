import { LLK } from ".";
import { ScuffVMConfigBase } from "../ScuffVMConfig";

export function loadModule<T>(path: string): Promise<T> {
    return new Promise((resolve, error) => requirejs([path], resolve, error));
}

export async function loadLLK(cfg: ScuffVMConfigBase) {
    await Promise.all([
        // loadModule<AudioEngine>(new URL("lib/scratch-audio.js", path).href).then(module => LLK._scratch_audio = module),
        // loadModule<RenderWebGL>(new URL("lib/scratch-render.min.js", path).href).then(module => LLK._scratch_render = module)
        loadModule<typeof AudioEngine>(cfg.libs.scratchAudio).then(module => LLK._scratch_audio = module),
        loadModule<typeof RenderWebGL>(cfg.libs.scratchRender).then(module => LLK._scratch_render = module)
    ]);
}

export default loadLLK;