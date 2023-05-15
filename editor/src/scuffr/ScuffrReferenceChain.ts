import { ScuffrWorkspace } from ".";
import { ScuffrElementScriptContainer } from "./ScuffrElementScriptContainer";
import type { ScuffrLinkReference, ScuffrReference, ScuffrReferenceable, ScuffrReferenceLink, ScuffrReferenceParent } from "./ScuffrReference";

export class ScuffrReferenceChain<TValue extends ScuffrReferenceable = ScuffrReferenceable> {
    public readonly indices: readonly number[];
    public readonly root: ScuffrElementScriptContainer;

    public constructor(terminalRef: ScuffrReference<TValue>) {
        let indices: any[] = [];

        indices.push(terminalRef.index);
        let value: ScuffrReferenceParent<any> = terminalRef.parent;

        while (!(value instanceof ScuffrElementScriptContainer)) {
            if (!value.getReference)
                throw new Error("Unreferencable element in reference chain.");
            let ref = value.getReference();
            indices.push(ref.index);
            value = ref.parent;
        }

        this.root = value;
        this.indices = indices;
    }

    public getTerminalReference(): ScuffrReference<TValue> {
        let value: ScuffrReferenceParent<any> = this.root;
        for (let i = this.indices.length - 1; i >= 1; i--)
            value = value.getReferenceValue(this.indices[i]);
        return { index: this.indices[0], parent: value };
    }
}