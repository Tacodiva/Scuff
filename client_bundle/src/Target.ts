import BlockScripts from "./block/BlockScripts";

class Target {

    public blockScripts : BlockScripts;

    public constructor() {
        this.blockScripts = new BlockScripts();
    }


}

export { Target as default }