import type { Vec2 } from "../utils/Vec2";
import type { BlockScript, BlockScriptRoot } from "./BlockScript";

export class BlockScripts {

    public scripts: BlockScriptRoot[];

    public transformPosition: Vec2;
    public transformScale: number;

    public constructor(scripts: BlockScriptRoot[] = []) {
        this.scripts = scripts;
        this.transformPosition = { x: 0, y: 0 };
        this.transformScale = 1;
    }
}