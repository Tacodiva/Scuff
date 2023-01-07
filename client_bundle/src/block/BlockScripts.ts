import type { Vec2 } from "../utils/Vec2";
import type { BlockScript } from "./BlockScript";

class BlockScripts {

    public scripts: BlockScript[];

    public transformPosition: Vec2;
    public transformScale: number;

    public constructor(scripts: BlockScript[] = []) {
        this.scripts = scripts;
        this.transformPosition = { x: 0, y: 0 };
        this.transformScale = 1;
    }
}

export { BlockScripts as default }