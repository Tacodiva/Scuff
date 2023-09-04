import type { ScuffConfig } from "./api/ScuffConfig";
import { ScuffCoreImpl, type ScuffCore } from "./ScuffCore";

export default async function (config: ScuffConfig): Promise<ScuffCore> {

    return new Promise(resolve => new ScuffCoreImpl(config.modules, resolve));
}