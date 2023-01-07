<script lang="ts">
    import { onMount } from "svelte";
    import type BlockScripts from "../src/block/BlockScripts";
    import {
        renderWorkspace,
        type SVGRenderedWorkspace,
    } from "../src/block/svg/SVGWorkspace";

    export var scripts: BlockScripts;

    var elementSVGRoot: SVGSVGElement;
    var elementBackgroundPattern: SVGPatternElement;
    var worksapce: SVGRenderedWorkspace;

    onMount(() => {
        worksapce = renderWorkspace(
            elementSVGRoot,
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
    width="100%"
    height="2000px"
    bind:this={elementSVGRoot}
>
    <pattern
        id="scuff-workspace-bg-pattern"
        width="50"
        height="50"
        patternUnits="userSpaceOnUse"
        bind:this={elementBackgroundPattern}
    >
    <rect width="100%" height="100%" class="scuff-workspace-bg-main"></rect>
    <circle cx="1" cy="1" r="1" class="scuff-workspace-bg-dots"></circle>
    </pattern>
</svg>
