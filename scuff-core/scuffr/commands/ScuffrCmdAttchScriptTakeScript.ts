import { ScuffrSvgScriptInput } from "..";
import { ScuffrSvgScript } from "../ScuffrSvgScript";
import { ScuffrSvgScriptRoot } from "../ScuffrSvgScriptRoot";
import type { ScuffrReference } from "../ScuffrReference";
import { ScuffrReferenceChain } from "../ScuffrReferenceChain";
import { ScuffrWrapInfo } from "../ScuffrWrappingDescriptor";
import type { ScuffrCmd } from "./ScuffrCmd";

export class ScuffrCmdAttchScriptTakeScript implements ScuffrCmd {
    public readonly target: ScuffrReferenceChain;
    public readonly targetIndex: number;

    public readonly wrappingInputIndex: number;
    public readonly sourceLength: number;

    public get workspace() { return this.target.workspace; }

    public constructor(source: ScuffrSvgScriptRoot, target: ScuffrReference, index: number, tryWrap: boolean) {
        this.sourceLength = source.children.length;
        this.target = new ScuffrReferenceChain(target);
        this.targetIndex = index;
        this.wrappingInputIndex = tryWrap ? source.getWrapperInput()?.getReference().index ?? -1 : -1;
    }

    public do(): void {
        const sourceScript = this.workspace.getSelectedScript();
        const targetReference = this.target.getTerminalReference();
        const target = targetReference.parent.getReferenceValue(targetReference.index);

        if (!(target instanceof ScuffrSvgScript))
            throw new Error("ScuffrCmdTakeScriptInputScript target must be a script");

        sourceScript.workspace.deleteRenderedScript(sourceScript, false);

        let wrappingInput: ScuffrSvgScriptInput | null = null;
        if (this.wrappingInputIndex !== -1) {
            wrappingInput = sourceScript.getWrapperInput();
            if (wrappingInput?.getReference().index !== this.wrappingInputIndex)
                throw new Error("Couldn't find wrapping input.");
        }

        if (this.targetIndex === 0 && !target.isSubscript) {
            if (wrappingInput) {
                const wrapInfo = new ScuffrWrapInfo(wrappingInput);
                target.translationSelf.x -= wrapInfo.renderOffset.x;
                target.translationSelf.y -= wrapInfo.renderOffset.y;
            } else {
                target.translationSelf.y += target.topOffset - sourceScript.bottomOffset;
            }
        }

        if (wrappingInput) {
            const innerBlocks = target.spliceBlocks(this.targetIndex, Infinity, sourceScript.children);

            if (innerBlocks.length !== 0) {
                wrappingInput.spliceBlocks(0, 0, innerBlocks);
            }
        } else {
            target.spliceBlocks(this.targetIndex, 0, sourceScript.children);
        }

        target.updateTranslation();
    }

    public undo(): void {
        const targetReference = this.target.getTerminalReference();
        const target = targetReference.parent.getReferenceValue(targetReference.index);

        if (!(target instanceof ScuffrSvgScript))
            throw new Error("ScuffrCmdTakeScriptInputScript target must be a script");

        const blocks = target.spliceBlocks(this.targetIndex, this.sourceLength);

        let wrappingInput: ScuffrSvgScriptInput | null = null;
        if (this.wrappingInputIndex !== -1) {
            wrappingInput = blocks[0].getReferenceValue(this.wrappingInputIndex);
            if (!(wrappingInput instanceof ScuffrSvgScriptInput))
                throw new Error("Wrapping inputs wasn't a script.");
        }

        if (wrappingInput) {
            const wrappedBlocks = wrappingInput.spliceBlocks(0, Infinity);
            target.spliceBlocks(this.targetIndex, 0, wrappedBlocks);
        }

        const script = new ScuffrSvgScriptRoot(this.workspace, null, blocks);
        this.workspace.addRenderedScript(script);

        if (this.targetIndex == 0 && !target.isSubscript) {
            if (wrappingInput) {
                const wrapInfo = new ScuffrWrapInfo(wrappingInput);
                target.translationSelf.x += wrapInfo.renderOffset.x;
                target.translationSelf.y += wrapInfo.renderOffset.y;
            } else {
                target.translationSelf.y -= target.topOffset - script.bottomOffset;
            }
        }

        target.updateTranslation();
    }
}