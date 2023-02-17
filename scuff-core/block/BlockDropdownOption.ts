import type { ScuffrBlockReference } from "../scuffr/ScuffrBlockReference";
import type { ScuffrElementBlockContent } from "../scuffr/ScuffrElementBlockContent";
import type { ScuffrElementBlockInstance } from "../scuffr/ScuffrElementBlockInstance";
import type { ScuffrElementInput } from "../scuffr/ScuffrElementInput";
import type { BlockDropdownProvider } from "./BlockDropdownProvider";
import type { BlockInput } from "./BlockInput";
import type { BlockPartInput } from "./BlockPartInput";

export class BlockDropdownOption implements BlockInput {
    public constructor(
        public readonly provider: BlockDropdownProvider,
        public readonly id: string,
        public readonly text: string
    ) { }

    public render(parent: ScuffrElementBlockInstance, parentRef: ScuffrBlockReference<BlockPartInput, ScuffrElementBlockContent>): ScuffrElementInput {
        return this.provider.renderOption(this, parent, parentRef);
    }

    public clone(): BlockInput {
        return new BlockDropdownOption(this.provider, this.id, this.text); 
    }
}