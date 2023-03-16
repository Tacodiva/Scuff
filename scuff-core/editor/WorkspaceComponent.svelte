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
    style="width:100vw; height:100vh; position: absolute;"
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
            <tspan x="2" dy="2.4em">Right click menu!</tspan>
            <tspan x="2" dy="1.2em">Now, to make the options actually do stuff...</tspan>

            <tspan x="2" dy="2.4em"
                >Now with themes! Try out <a
                    href="https://scuff.emberj.sh/?light+bold+contrast"
                    >https://scuff.emberj.sh/?light+bold+contrast</a
                ></tspan
            >
            <tspan x="2" dy="1.2em"
                >...or maybe <a href="https://scuff.emberj.sh/?neon"
                    >https://scuff.emberj.sh/?neon</a
                ></tspan
            >
            <tspan x="2" dy="2.4em">Scuffr TODO List:</tspan>
            <tspan x="2" dy="1.2em">[X] Make inputs editable</tspan>
            <tspan x="2" dy="1.2em">[X] Make block updates more efficient</tspan
            >
            <tspan x="2" dy="1.2em"
                >[X] Add support for rendering C blocks</tspan
            >
            <tspan x="2" dy="1.2em">[X] Add attachment points to C blocks</tspan
            >
            <tspan x="2" dy="1.2em"
                >[X] Make dropping C blocks wrap the blocks below it</tspan
            >
            <tspan x="2" dy="1.2em"
                >[X] Make replacing another input not delete it</tspan
            >
            <tspan x="2" dy="1.2em">[X] Add boolean inputs and blocks</tspan>
            <tspan x="2" dy="1.2em"
                >[X] Add head and tail blocks (w/ cute cat ears)</tspan
            >
            <tspan x="2" dy="1.2em">[X] Add input highlighting</tspan>
            <tspan x="2" dy="1.2em"
                >[X] Add ghost blocks to preview drag and drop</tspan
            >
            <tspan x="2" dy="1.2em">[X] Actually validate block inputs</tspan>
            <tspan x="2" dy="1.2em"
                >[X] Add horizontal and vertical scroll bar</tspan
            >
            <tspan x="2" dy="1.2em">[X] Add support for icons in blocks</tspan>
            <tspan x="2" dy="1.2em">[X] Add dropdown block inputs</tspan>
            <tspan x="2" dy="1.2em">[ ] Fix nested block spacing</tspan>
            <tspan x="2" dy="1.2em">[X] Undo / Redo support</tspan>
            <tspan x="2" dy="1.2em">[ ] Make tab move to the next input</tspan>
            <tspan x="2" dy="1.2em">[ ] Add block palette sidebar</tspan>
            <tspan x="2" dy="1.2em">[X] Right click menu</tspan>
            <tspan x="2" dy="1.2em">[ ] Comment code (god please no don't make me)</tspan>
            <tspan x="2" dy="1.2em">[ ] Come up with more TODOs</tspan>
        </text>
    </svg>
</div>
