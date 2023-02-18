<script lang="ts">
    import { onMount } from "svelte";
    import type { BlockScripts } from "../block/BlockScripts";
    import { ScuffCoreImpl } from "../ScuffCore";
    import { ScuffrWorkspace } from "../scuffr/ScuffrWorkspace";
    import ScrollbarComponent from "./scrollbar/ScrollbarComponent.svelte";

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
            elementBackgroundPattern,
            scripts
        );

        var endTime = performance.now();
        console.log(`Render took ${endTime - startTime}ms`);

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
        <defs>
            <pattern
                id="scuff-workspace-bg-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                bind:this={elementBackgroundPattern}
            >
                <rect
                    width="100%"
                    height="100%"
                    class="scuff-workspace-bg-main"
                />
                <circle cx="1" cy="1" r="1" class="scuff-workspace-bg-dots" />
            </pattern>

            <filter
                id="scuff-input-highlight"
                height="160%"
                width="180%"
                y="-30%"
                x="-40%"
                ><feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feComponentTransfer result="outBlur">
                    <feFuncA
                        type="table"
                        tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
                    />
                </feComponentTransfer>
                <feFlood
                    flood-color="#FFFFFF"
                    flood-opacity="1"
                    result="outColor"
                />
                <feComposite
                    in="outColor"
                    in2="outBlur"
                    operator="in"
                    result="outGlow"
                />
                <feComposite in="SourceGraphic" in2="outGlow" operator="over" />
            </filter>

            <symbol id="scuff-block-green-flag" viewBox="0 0 24 24">
                <path
                    fill="#45993d"
                    d="M20.8,3.7c-0.4-0.2-0.9-0.1-1.2,0.2c-2,1.6-4.8,1.6-6.8,0c-2.3-1.9-5.6-2.3-8.3-1V2.5c0-0.6-0.5-1-1-1s-1,0.4-1,1v18.8c0,0.5,0.5,1,1,1h0.1c0.5,0,1-0.5,1-1v-6.4c1-0.7,2.1-1.2,3.4-1.3c1.2,0,2.4,0.4,3.4,1.2c2.9,2.3,7,2.3,9.8,0c0.3-0.2,0.4-0.5,0.4-0.9V4.7C21.6,4.2,21.3,3.8,20.8,3.7z M20.5,13.9C20.5,13.9,20.5,13.9,20.5,13.9C18,16,14.4,16,11.9,14c-1.1-0.9-2.5-1.4-4-1.4c-1.2,0.1-2.3,0.5-3.4,1.1V4C7,2.6,10,2.9,12.2,4.6c2.4,1.9,5.7,1.9,8.1,0c0.1,0,0.1,0,0.2,0c0,0,0.1,0.1,0.1,0.1L20.5,13.9z"
                />
                <path
                    fill="#4cbf56"
                    d="M20.6,4.8l-0.1,9.1c0,0,0,0.1,0,0.1c-2.5,2-6.1,2-8.6,0c-1.1-0.9-2.5-1.4-4-1.4c-1.2,0.1-2.3,0.5-3.4,1.1V4C7,2.6,10,2.9,12.2,4.6c2.4,1.9,5.7,1.9,8.1,0c0.1,0,0.1,0,0.2,0C20.5,4.7,20.6,4.7,20.6,4.8z"
                />
            </symbol>

            <symbol id="scuff-block-dropdown-arrow" viewBox="0 0 12.71 8.79">
                <g opacity="0.1">
                    <path
                        fill="#231f20"
                        d="M12.71,2.44A2.41,2.41,0,0,1,12,4.16L8.08,8.08a2.45,2.45,0,0,1-3.45,0L0.72,4.16A2.42,2.42,0,0,1,0,2.44,2.48,2.48,0,0,1,.71.71C1,0.47,1.43,0,6.36,0S11.75,0.46,12,.71A2.44,2.44,0,0,1,12.71,2.44Z"
                    />
                </g>
                <path
                    fill="#fff"
                    d="M6.36,7.79a1.43,1.43,0,0,1-1-.42L1.42,3.45a1.44,1.44,0,0,1,0-2c0.56-.56,9.31-0.56,9.87,0a1.44,1.44,0,0,1,0,2L7.37,7.37A1.43,1.43,0,0,1,6.36,7.79Z"
                />
            </symbol>
        </defs>
        <g bind:this={elementWorkspace} />
        <text
            style="fill:var(--scuff-workspace-text);font-family:monospace;"
            dominant-baseline="hanging"
        >
            <tspan x="2" y="5"
                >Scuff {ScuffCoreImpl.version[0]}.{ScuffCoreImpl
                    .version[1]}</tspan
            >
            <tspan x="2" dy="2.4em">Please ignore the half finished dropdown menus.</tspan>

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
            <tspan x="2" dy="1.2em">[ ] Add dropdown block inputs</tspan>
            <tspan x="2" dy="1.2em">[ ] Fix nested block spacing</tspan>
            <tspan x="2" dy="1.2em">[ ] Undo / Redo support</tspan>
            <tspan x="2" dy="1.2em">[ ] Make tab move to the next input</tspan>
            <tspan x="2" dy="1.2em">[ ] Add block palette sidebar</tspan>
            <tspan x="2" dy="1.2em">[ ] Investigate touchscreen support</tspan>
            <tspan x="2" dy="1.2em">[ ] Come up with more TODOs</tspan>
        </text>
    </svg>
</div>
