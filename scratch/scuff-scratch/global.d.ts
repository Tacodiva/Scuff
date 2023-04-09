/// <reference path="../../node_modules/@turbowarp/types/types/scratch-audio.d.ts" />
/// <reference path="../../node_modules/@turbowarp/types/types/scratch-render.d.ts" />
/// <reference path="../shared/messages.ts" />

declare module "*.txt" {
    const content: string;
    export default content;
}