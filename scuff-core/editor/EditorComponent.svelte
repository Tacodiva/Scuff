<script lang="ts">
	import type { BlockScripts } from "../block/BlockScripts";
	import Workspace from "./WorkspaceComponent.svelte";

	export var scripts: BlockScripts;
</script>

<Workspace {scripts} />
