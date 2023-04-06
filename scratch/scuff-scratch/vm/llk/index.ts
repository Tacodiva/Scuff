
export const LLK = {

    _scratch_render: undefined as RenderWebGL | undefined,
    get renderEngine(): RenderWebGL {
        if (this._scratch_render) return this._scratch_render
        throw new Error("Module not loaded.");
    },

    _scratch_audio: undefined as AudioEngine | undefined,
    get audioEngine(): AudioEngine {
        if (this._scratch_audio) return this._scratch_audio
        throw new Error("Module not loaded.");
    }
};

export default LLK;