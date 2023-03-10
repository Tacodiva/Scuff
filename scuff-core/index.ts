import './css';

export * from './scuffr';
export * from './block';
export * from './api';
export { l10n, l10nString } from './l10n';
export { default as WorkspaceDefinitionComponent } from './editor/WorkspaceDefinitionComponent.svelte'
export { default as WorkspaceComponent } from './editor/WorkspaceComponent.svelte'
export { type ScuffCore } from './ScuffCore';
export { default as load } from './load';

(<any>globalThis).SVG_NS = "http://www.w3.org/2000/svg";
