<script lang="ts">
    import type { ScuffEditorScrollableArea } from "./ScuffEditorScrollableArea";

    export let pane: ScuffEditorScrollableArea;

    $: topLeft = {
        x: Math.min(
            $pane.contentTopLeft.x,
            $pane.scroll.x - $pane.clientSize.x / 2
        ),
        y: Math.min(
            $pane.contentTopLeft.y,
            $pane.scroll.y - $pane.clientSize.y / 2
        ),
    };

    $: bottomRight = {
        x: Math.max($pane.contentBottomRight.x, $pane.scroll.x),
        y: Math.max($pane.contentBottomRight.y, $pane.scroll.y),
    };

    function bound(scroll: number, axis: "x" | "y") {
        const offset = $pane.clientSize[axis] / 2;
        return Math.min(
            Math.max(scroll, topLeft[axis] + offset),
            bottomRight[axis] - $pane.viewportSize[axis] + offset
        );
    }

    $: scroll = {
        x: bound($pane.scroll.x, "x"),
        y: bound($pane.scroll.y, "y"),
    };

    $: contentDimentions = {
        x: bottomRight.x - topLeft.x,
        y: bottomRight.y - topLeft.y,
    };

    $: handleSize = {
        x: $pane.viewportSize.x / contentDimentions.x,
        y: $pane.viewportSize.y / contentDimentions.y,
    };

    $: handlePos = {
        x:
            (scroll.x - $pane.clientSize.x / 2 - topLeft.x) /
            contentDimentions.x,
        y:
            (scroll.y - $pane.clientSize.y / 2 - topLeft.y) /
            contentDimentions.y,
    };

    let horizontalBar: SVGRectElement;
    let vertialBar: SVGRectElement;

    $: visible = {
        x: handleSize.x < 1,
        y: handleSize.y < 1,
    };

    function grab(e: MouseEvent, axis: "x" | "y", bar: SVGRectElement) {
        const initalMousePos = e[axis];
        let initalScroll = scroll[axis];

        bar.classList.add("scuff-scrollbar-handle-active");

        function mouseMove(e: MouseEvent) {
            let delta = e[axis] - initalMousePos;
            initalScroll = bound(initalScroll, axis);

            pane.update((info) => {
                info.scroll[axis] = bound(
                    (delta / $pane.clientSize[axis]) * contentDimentions[axis] +
                        initalScroll,
                    axis
                );
                return info;
            });
        }

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener(
            "mouseup",
            (e) => {
                window.removeEventListener("mousemove", mouseMove);
                bar.classList.remove("scuff-scrollbar-handle-active");
            },
            true
        );

        e.preventDefault();
        e.stopPropagation();
    }

    function grabY(e: MouseEvent) {
        grab(e, "y", vertialBar);
    }

    function grabX(e: MouseEvent) {
        grab(e, "x", horizontalBar);
    }
</script>

{#if visible.x}
    <rect
        class="scuff-scrollbar-handle"
        rx="3"
        ry="3"
        height="6"
        width={handleSize.x * 100 + "%"}
        x={handlePos.x * 100 + "%"}
        y={$pane.clientSize.y - 8}
        on:mousedown={grabX}
        bind:this={horizontalBar}
    />
{/if}

{#if visible.y}
    <rect
        class="scuff-scrollbar-handle"
        rx="3"
        ry="3"
        width="6"
        height={handleSize.y * 100 + "%"}
        x={$pane.clientSize.x - 8}
        y={handlePos.y * 100 + "%"}
        on:mousedown={grabY}
        bind:this={vertialBar}
    />
{/if}
