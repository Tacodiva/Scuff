import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";
import type { BlockInstance } from "../../block";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";


export class ScuffrCmdScriptSelectSpawn implements ScuffrCmdScriptSelect {

    public readonly blocks: BlockInstance[];
    public targetPosition: Vec2;
    public readonly root: ScuffrElementScriptContainer;    

    public constructor(root: ScuffrElementScriptContainer, blocks: BlockInstance[], targetPosition: Vec2) {
        this.root = root;
        this.blocks = blocks;
        this.targetPosition = targetPosition;
    }

    public do(): void {
        this.root.renderScript(this.blocks.map(block => block.clone()), this.targetPosition);
    }

    public undo(): void {
        this.root.deleteScript(this.root.getSelectedScript());
    }
}