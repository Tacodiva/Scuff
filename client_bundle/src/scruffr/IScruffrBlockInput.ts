import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import type { IScruffrPointAttachable } from "./attachment_points/ScruffrAttachmentPoint";
import type { IScruffrBlockPartElement } from "./IScruffrBlockPartElement";
import type { ScruffrBlockContentElement } from "./ScruffrBlockContentElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import type { ScruffrElement } from "./ScruffrElement";

export interface IScruffrBlockInput extends IScruffrPointAttachable, IScruffrBlockPartElement, ScruffrElement {
    asInput(): IBlockInput;
    setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>): void;
}