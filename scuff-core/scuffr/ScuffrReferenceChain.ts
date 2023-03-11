import { ScuffrWorkspace } from ".";
import type { ScuffrReference, ScuffrReferenceable, ScuffrReferenceLink, ScuffrReferenceParent } from "./ScuffrReference";

export class ScuffrReferneceChain<TValue extends ScuffrReferenceable> {
    public readonly indices: readonly number[];
    public readonly workspace: ScuffrWorkspace;

    public constructor(terminalRef: ScuffrReference<TValue>) {
        let indices: any[] = [];

        indices.push(terminalRef.index);
        let value: ScuffrReferenceParent<any> = terminalRef.parent;

        while (!(value instanceof ScuffrWorkspace)) {
            let ref = value.getReference();
            indices.push(ref.index);
            value = ref.parent;
        }

        this.workspace = value;
        this.indices = indices;
    }

    public getValue(): TValue {
        let i = this.indices.length - 1;

        let value: ScuffrReferenceLink<any> = this.workspace.getScript(this.indices[i--]);

        for (; i >= 0; i--)
            value = value.getIndexValue(this.indices[i]);

        return value as any as TValue;
    }
}