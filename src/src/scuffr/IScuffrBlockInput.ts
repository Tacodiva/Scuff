import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import type { IScuffrPointAttachable } from "./attachment_points/ScuffrAttachmentPoint";
import type { IScuffrBlockPartElement } from "./IScuffrBlockPartElement";
import type { ScuffrBlockContentElement } from "./ScuffrBlockContentElement";
import type { ScuffrBlockRef } from "./ScuffrBlockRef";
import type { ScuffrElement } from "./ScuffrElement";

export interface IScuffrBlockInput extends IScuffrPointAttachable, IScuffrBlockPartElement, ScuffrElement {
    asInput(): IBlockInput;
    setParent(parentRef: ScuffrBlockRef<BlockInputType<IBlockInput>, ScuffrBlockContentElement>): void;
}