<script lang="ts">
    import { onMount } from "svelte";
    import type { BlockScripts } from "../src/block/BlockScripts";
    import { ScuffrWorkspace } from "../src/scuffr/ScuffrWorkspace";

    export var scripts: BlockScripts;

    var elementSVGRoot: SVGSVGElement;
    var elementBackgroundPattern: SVGPatternElement;
    var elementWorkspace: SVGGElement;
    var worksapce: ScuffrWorkspace;

    onMount(() => {
        worksapce = new ScuffrWorkspace(
            elementWorkspace,
            elementBackgroundPattern,
            scripts
        );
        worksapce.addListeners();

        return () => {
            worksapce.removeListeners();
        };
    });
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    style="width: 100vw; height: 100vh;"
    bind:this={elementSVGRoot}
    class="scuff-theme-dark"
>
    <defs>
        <pattern
            id="scuff-workspace-bg-pattern"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
            bind:this={elementBackgroundPattern}
        >
            <rect width="100%" height="100%" class="scuff-workspace-bg-main" />
            <circle cx="1" cy="1" r="1" class="scuff-workspace-bg-dots" />
        </pattern>
    </defs>
    <g bind:this={elementWorkspace} />
    <text style="fill:var(--scuff-workspace-text);font-family:monospace;" dominant-baseline="hanging">
        <tspan x="2" y="5">Scuff alpha 7</tspan>
        <tspan x="2" dy="1.2em">C blocks now somewhat functional!</tspan>
        <tspan x="2" dy="2.4em">Scuffr TODO List:</tspan>
        <tspan x="2" dy="1.2em">[X] Make inputs editable</tspan>
        <tspan x="2" dy="1.2em">[X] Make block updates more efficient</tspan>
        <tspan x="2" dy="1.2em">[X] Add support for rendering C blocks</tspan>
        <tspan x="2" dy="1.2em">[X] Add attachment points to C blocks</tspan>
        <tspan x="2" dy="1.2em">[X] Make dropping C blocks wrap the blocks below it</tspan>
        <tspan x="2" dy="1.2em">[ ] Make replacing another input not delete it</tspan>
        <tspan x="2" dy="1.2em">[ ] Add boolean inputs and blocks</tspan>
        <tspan x="2" dy="1.2em">[ ] Add head and tail blocks (w/ cute cat ears)</tspan>
        <tspan x="2" dy="1.2em">[ ] Add input highlighting</tspan>
        <tspan x="2" dy="1.2em">[ ] Add ghost blocks to preview drag and drop</tspan>
        <tspan x="2" dy="1.2em">[ ] Actually validate block inputs</tspan>
        <tspan x="2" dy="1.2em">[ ] Add horizontal and vertical scroll bar</tspan>
        <tspan x="2" dy="1.2em">[ ] Add dropdown block inputs</tspan>
        <tspan x="2" dy="1.2em">[ ] Add block palette sidebar</tspan>
        <tspan x="2" dy="1.2em">[ ] Investigate touchscreen support</tspan>
        <tspan x="2" dy="1.2em">[ ] Come up with more TODOs</tspan>
    </text>
</svg>
