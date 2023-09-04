import type { ScuffrCmdScriptSelect } from "./ScuffrCmdScriptSelect";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { BlockInstance, Vec2 } from "@scuff/core";


export class ScuffrCmdScriptSelectSpawn implements ScuffrCmdScriptSelect {

    public readonly blocks: readonly BlockInstance[];
    public targetPosition: Vec2;
    public readonly root: ScuffrElementScriptContainer;    

    public constructor(root: ScuffrElementScriptContainer, blocks: readonly BlockInstance[], targetPosition: Vec2) {
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