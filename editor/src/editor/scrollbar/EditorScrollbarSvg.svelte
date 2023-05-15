<script lang="ts">
    import type { ScuffEditorScrollableArea } from "./ScuffEditorScrollableArea";

    export let pane: ScuffEditorScrollableArea;

    pane.subscribe((paneVal) => {
        if (paneVal.enforceBounds) {
            const viewportSize = {
                x: paneVal.viewportBottomRight.x - paneVal.viewportTopLeft.x,
                y: paneVal.viewportBottomRight.y - paneVal.viewportTopLeft.y,
            };

            function checkLowerBound(axis: "x" | "y") {
                const lower = paneVal.contentTopLeft[axis];
                if (lower > paneVal.viewportTopLeft[axis]) {
                    const upper = lower + viewportSize[axis];
                    paneVal.viewportTopLeft[axis] = lower;
                    paneVal.viewportBottomRight[axis] = upper;
                    return true;
                }
                return false;
            }

            function checkUpperBound(axis: "x" | "y") {
                const upper = paneVal.contentBottomRight[axis];
                if (upper < paneVal.viewportBottomRight[axis]) {
                    const lower = upper - viewportSize[axis];
                    if (lower >= paneVal.contentTopLeft[axis]) {
                        paneVal.viewportTopLeft[axis] = lower;
                        paneVal.viewportBottomRight[axis] = upper;
                        return true;
                    } else if (paneVal.viewportTopLeft[axis] !== paneVal.contentTopLeft[axis]) {
                        paneVal.viewportTopLeft[axis] = paneVal.contentTopLeft[axis];
                        paneVal.viewportBottomRight[axis] = paneVal.contentTopLeft[axis] + viewportSize[axis];
                        return true;
                    }
                }
                return false;
            }

            let update = false;

            update ||= checkLowerBound("x");
            update ||= checkLowerBound("y");
            update ||= checkUpperBound("x");
            update ||= checkUpperBound("y");

            if (update) pane.set(paneVal);
        }
    });

    $: topLeft = {
        x: Math.min($pane.contentTopLeft.x, $pane.viewportTopLeft.x),
        y: Math.min($pane.contentTopLeft.y, $pane.viewportTopLeft.y),
    };

    $: bottomRight = {
        x: Math.max($pane.contentBottomRight.x, $pane.viewportBottomRight.x),
        y: Math.max($pane.contentBottomRight.y, $pane.viewportBottomRight.y),
    };

    $: contentDimentions = {
        x: bottomRight.x - topLeft.x,
        y: bottomRight.y - topLeft.y,
    };

    $: viewportSize = {
        x: $pane.viewportBottomRight.x - $pane.viewportTopLeft.x,
        y: $pane.viewportBottomRight.y - $pane.viewportTopLeft.y,
    };

    $: handleStart = {
        x: (($pane.viewportTopLeft.x - topLeft.x) / contentDimentions.x) * $pane.domSize.x,
        y: (($pane.viewportTopLeft.y - topLeft.y) / contentDimentions.y) * $pane.domSize.y,
    };

    $: handleEnd = {
        x: (($pane.viewportBottomRight.x - topLeft.x) / contentDimentions.x) * $pane.domSize.x,
        y: (($pane.viewportBottomRight.y - topLeft.y) / contentDimentions.y) * $pane.domSize.y,
    };

    $: visible = {
        x: (handleStart.x !== 0 || handleEnd.x < $pane.domSize.x) && contentDimentions.x !== 0,
        y: (handleStart.y !== 0 || handleEnd.y < $pane.domSize.y) && contentDimentions.y !== 0,
    };

    $: handleSize = {
        x: handleEnd.x - handleStart.x,
        y: handleEnd.y - handleStart.y,
    };

    let horizontalBar: SVGRectElement;
    let vertialBar: SVGRectElement;

    function grab(e: MouseEvent, axis: "x" | "y", bar: SVGRectElement) {
        const initalMousePos = e[axis];
        const initalPosition = $pane.viewportTopLeft[axis];
        const scale = contentDimentions[axis] / $pane.domSize[axis];

        bar.classList.add("scuff-scrollbar-handle-active");

        function mouseMove(e: MouseEvent) {
            pane.update((info) => {
                const delta = (e[axis] - initalMousePos) * scale;
                info.viewportTopLeft[axis] = initalPosition + delta;
                info.viewportBottomRight[axis] = info.viewportTopLeft[axis] + viewportSize[axis];
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
    <rect class="scuff-scrollbar-handle" rx="3" ry="3" height="6" width={handleSize.x} x={handleStart.x} y={$pane.domSize.y - 8} on:mousedown={grabX} bind:this={horizontalBar} />
{/if}

{#if visible.y}
    <rect class="scuff-scrollbar-handle" rx="3" ry="3" width="6" height={handleSize.y} x={$pane.domSize.x - 8} y={handleStart.y} on:mousedown={grabY} bind:this={vertialBar} />
{/if}
