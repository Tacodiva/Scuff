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
    <text style="fill:white;font-family:monospace;" dominant-baseline="hanging">
        <tspan x="2" y="5">Scuff alpha 4</tspan>
        <tspan x="2" dy="1.2em">Now with editable inputs!</tspan>
    </text>
</svg>
