import './css';

export * from './scuffr';
export * from './block';
export * from './api';
export * from './editor';
export { l10n, l10nString } from './l10n';
export { type ScuffCore } from './ScuffCore';
export { default as load } from './load';
export { Target } from './Target';

(<any>globalThis).SVG_NS = "http://www.w3.org/2000/svg";
