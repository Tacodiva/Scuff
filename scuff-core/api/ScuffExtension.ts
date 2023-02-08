import type { ScuffCore } from "../ScuffCore";

export interface ScuffExtension {
    init(core: ScuffCore): void;
}
