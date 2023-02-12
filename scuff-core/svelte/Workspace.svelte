<script lang="ts">
    import { onMount } from "svelte";
    import type { BlockScripts } from "../block/BlockScripts";
    import { ScuffCoreImpl } from "../ScuffCore";
    import { ScuffrWorkspace } from "../scuffr/ScuffrWorkspace";

    export var scripts: BlockScripts;

    var elementSVGRoot: SVGSVGElement;
    var elementBackgroundPattern: SVGPatternElement;
    var elementWorkspace: SVGGElement;
    var worksapce: ScuffrWorkspace;

    onMount(() => {
        if (location.href.includes("light")) elementSVGRoot.classList.add("scuff-theme-light");
        if (location.href.includes("contrast")) elementSVGRoot.classList.add("scuff-theme-contrast-blocks");
        if (location.href.includes("bold")) elementSVGRoot.classList.add("scuff-theme-bold");
        
        worksapce = new ScuffrWorkspace(
            elementSVGRoot,
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
    style="width: 10000px; height: 10000px;"
    bind:this={elementSVGRoot}
    class="scuff-theme-default"
>
    <defs>
        <pattern
            id="scuff-workspace-bg-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            bind:this={elementBackgroundPattern}
        >
            <rect width="100%" height="100%" class="scuff-workspace-bg-main" />
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
    </defs>
    <g bind:this={elementWorkspace} />
    <text
        style="fill:var(--scuff-workspace-text);font-family:monospace;"
        dominant-baseline="hanging"
    >
        <tspan x="2" y="5">Scuff {ScuffCoreImpl.version[0]}.{ScuffCoreImpl.version[1]}</tspan>
        <tspan x="2" dy="1.2em">Now with themes! <a href="https://scuff.emberj.sh/?light+bold+contrast">https://scuff.emberj.sh/?light+bold+contrast</a></tspan>
        <tspan x="2" dy="2.4em">Scuffr TODO List:</tspan>
        <tspan x="2" dy="1.2em">[X] Make inputs editable</tspan>
        <tspan x="2" dy="1.2em">[X] Make block updates more efficient</tspan>
        <tspan x="2" dy="1.2em">[X] Add support for rendering C blocks</tspan>
        <tspan x="2" dy="1.2em">[X] Add attachment points to C blocks</tspan>
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
            >[ ] Add horizontal and vertical scroll bar</tspan
        >
        <tspan x="2" dy="1.2em">[ ] Add dropdown block inputs</tspan>
        <tspan x="2" dy="1.2em">[ ] Add support for icons in blocks</tspan>
        <tspan x="2" dy="1.2em">[ ] Add block palette sidebar</tspan>
        <tspan x="2" dy="1.2em">[ ] Undo / Redo support</tspan>
        <tspan x="2" dy="1.2em">[ ] Investigate touchscreen support</tspan>
        <tspan x="2" dy="1.2em">[ ] Come up with more TODOs</tspan>
    </text>
</svg>
