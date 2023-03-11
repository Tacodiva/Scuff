import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { ScuffrReferenceInput } from "../scuffr/ScuffrReferenceTypes";
import type { BlockDropdownProvider } from "./BlockDropdownProvider";
import type { BlockInput } from "./BlockInput";

export class BlockDropdownOption implements BlockInput {
    public constructor(
        public readonly provider: BlockDropdownProvider,
        public readonly id: string,
        public readonly text: string
    ) { }

    public render(reference: ScuffrReferenceInput): ScuffrElementInput {
        return this.provider.renderOption(this, reference);
    }

    public clone(): BlockInput {
        return new BlockDropdownOption(this.provider, this.id, this.text); 
    }
}