<script lang="ts">
    import type { BlockScripts } from "../src/block/BlockScripts";
	import Workspace from "./Workspace.svelte";

	export var scripts : BlockScripts;
</script>

<Workspace {scripts}/>