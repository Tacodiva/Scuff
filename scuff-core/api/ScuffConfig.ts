
import type { ScuffExtensionLoader } from './ScuffExtensionLoader';

export type ScuffExtensionDefinition = (ScuffExtensionLoader | string);

export interface ScuffConfig {
    path: string;
    extensions: ScuffExtensionDefinition[];
}

