<script lang="ts">
    import { onMount } from "svelte";
    import type { BlockScripts } from "../block/BlockScripts";
    import { ScuffCoreImpl } from "../ScuffCore";
    import { ScuffrWorkspace } from "../scuffr/ScuffrWorkspace";
    import ScrollbarComponent from "./scrollbar/ScrollbarComponent.svelte";
    import WorkspaceDefinitionComponent from "./WorkspaceDefinitionComponent.svelte";

    export var scripts: BlockScripts;

    var elementContainer: HTMLElement;
    var elementSVGRoot: SVGSVGElement;
    var elementBackgroundPattern: SVGPatternElement;
    var elementWorkspace: SVGGElement;
    var workspace: ScuffrWorkspace;

    onMount(() => {
        document.body.classList.add("scuff-theme-default");
        if (location.href.includes("light"))
            document.body.classList.add("scuff-theme-light");
        if (location.href.includes("contrast"))
            document.body.classList.add("scuff-theme-contrast-blocks");
        if (location.href.includes("bold"))
            document.body.classList.add("scuff-theme-bold");
        if (location.href.includes("neon"))
            document.body.classList.add("scuff-theme-neon");

        var startTime = performance.now();

        workspace = new ScuffrWorkspace(
            elementSVGRoot,
            elementWorkspace,
            document.getElementById("scuff-workspace-bg-pattern") as any,
            scripts
        );

        var endTime = performance.now();
        // console.log(`Render took ${endTime - startTime}ms`);

        workspace.addListeners();

        return () => {
            workspace.removeListeners();
        };
    });
</script>

<div
    bind:this={elementContainer}
    style="width:100%; height:100%;"
>
    {#if !!workspace}
        <ScrollbarComponent pane={workspace.scrollPane} />
    {/if}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style="width: 100%; height: 100%;"
        bind:this={elementSVGRoot}
    >
        <WorkspaceDefinitionComponent />
        <g bind:this={elementWorkspace} />
        <text
            style="fill:var(--scuff-workspace-text);font-family:monospace;"
            dominant-baseline="hanging"
        >
            <tspan x="2" y="5"
                >Scuff {ScuffCoreImpl.version[0]}.{ScuffCoreImpl
                    .version[1]}</tspan
            >
        </text>
    </svg>
</div>
