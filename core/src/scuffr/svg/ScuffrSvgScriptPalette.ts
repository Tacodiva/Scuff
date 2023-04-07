import type { BlockScriptRoot } from "../../block/BlockScriptRoot";
import type { Vec2 } from "../../utils/Vec2";
import { ScuffrCmdScriptSelectRoot } from "../commands/ScuffrCmdScriptSelectRoot";
import { ScuffrCmdScriptSelectSpawn } from "../commands/ScuffrCmdScriptSelectSpawn";
import { ScuffrInteractionDragScript } from "../interactions/ScuffrInteractionDragScript";
import type { ScuffrElementScriptContainer } from "../ScuffrElementScriptContainer";
import type { ScuffrReferenceBlock } from "../ScuffrReferenceTypes";
import type { ScuffrSvgBlock } from "./ScuffrSvgBlock";
import { ScuffrSvgScriptRoot } from "./ScuffrSvgScriptRoot";

export class ScuffrSvgScriptPalette extends ScuffrSvgScriptRoot {

    public readonly targetContainer: ScuffrElementScriptContainer;

    public constructor(scriptContainer: ScuffrElementScriptContainer, script: BlockScriptRoot, targetContainer: ScuffrElementScriptContainer) {
        super(scriptContainer, script);
        this.targetContainer = targetContainer;
    }

    public override onChildBlockDrag(reference: ScuffrReferenceBlock, event: MouseEvent): boolean {
        const pos = this.targetContainer.toWorkspaceCoords(this.scriptContainer.toViewportCoords(this.script.translation));
        new ScuffrInteractionDragScript(new ScuffrCmdScriptSelectSpawn(this.targetContainer, this.script.blocks, pos), event).start();
        return true;
    }
}