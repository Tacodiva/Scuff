import { LLK } from ".";

export function loadModule<T>(path: string): Promise<T> {
    return new Promise((resolve, error) => requirejs([path], resolve, error));
}

export async function loadLLK(path: string) {
    await Promise.all([
        loadModule<AudioEngine>(new URL("lib/scratch-audio.js", path).href).then(module => LLK._scratch_audio = module),
        loadModule<RenderWebGL>(new URL("lib/scratch-render.min.js", path).href).then(module => LLK._scratch_render = module)
    ]);
}

export default loadLLK;