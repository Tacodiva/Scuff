
import type { ScuffExtensionLoader } from '../api/ScuffExtensionLoader';

export type ScuffExtensionDefinition = ({ loader: ScuffExtensionLoader, path?: string } | string);

export interface ScuffConfig {
    path: string;
    extensions: ScuffExtensionDefinition[];
}

