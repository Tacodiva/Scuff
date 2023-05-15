<script lang="ts">
    import type { ScuffCore } from "@scuff/core";

    export var core: ScuffCore;
</script>

<div class="scuff-block-text">
    <h1>Scuff! {core.version[0]}.{core.version[1]}a</h1>

    <p>Hypno-cat</p>

    <p>
        Try out <a href="https://scuff.emberj.sh/?light+bold+contrast">https://scuff.emberj.sh/?light+bold+contrast</a>
        ...or maybe <a href="https://scuff.emberj.sh/?neon">https://scuff.emberj.sh/?neon</a>
    </p>

    <p>See my TODO list <a href="https://github.com/Tacodiva/Scuff/issues/1">here</a>.</p>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 10px;
        box-sizing: border-box;
        overflow: scroll;
    }

    p {
        font-family: monospace;
        margin: 0px;
    }
</style>
