
import type { ScuffExtension } from './ScuffExtension';

export type ScuffExtensionDefinition = (ScuffExtension | string);

export interface ScuffConfig {

    extensions: ScuffExtensionDefinition[];
}

