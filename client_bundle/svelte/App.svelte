<script lang="ts">
    import type BlockScripts from "../src/block/BlockScripts";
	// import { onMount } from "svelte";
	// import Blocks from "../src/blocks/Blocks";
	// import { renderTargetScripts } from "../src/SVGRenderer";
	// import Target from "../src/Target";
	// import { TargetScript } from "../src/TargetScript";
	import Target from "../src/Target";
	import SvgWorkspace from "./SVGWorkspace.svelte";

	export var scripts : BlockScripts;

	// // import { onMount } from "svelte";
	// // import monaco from "./monaco_loader";
	// // import * as monaco from 'monaco-editor';

	// // 	(await monaco).editor.create(document.getElementById("editor")!, {
	// // 		value: "",
	// // 		language: "javascript",
	// // 		theme: "vs-dark"
	// // 	})
	// // });

	// onMount(() => {
	// 	const workspaceContainer = <SVGGElement>(
	// 		(<unknown>document.getElementById("workspace")!)
	// 	);

	// 	const target = new Target();
	// 	target.scripts.push(new TargetScript([
	// 		Blocks.MOVE_STEPS.createInstance({
	// 			test: Blocks.OP_PLUS.createInstance({
	// 				test: Blocks.OP_PLUS.createInstance({
	// 					test: Blocks.OP_PLUS.createInstance({}),
	// 					testII: Blocks.OP_PLUS.createInstance(),
	// 				}),
	// 				testII: Blocks.OP_PLUS.createInstance(),
	// 			}),
	// 		}),
	// 		Blocks.MOVE_STEPS.createInstance(),
	// 		Blocks.MOVE_STEPS.createInstance({
	// 			test: Blocks.OP_PLUS.createInstance({}),
	// 		}),
	// 	]));

	// 	renderTargetScripts(workspaceContainer, target);

	// });
</script>

<SvgWorkspace {scripts}/>

<!-- <div id="editor" style="height: 300px; width: 600px;"></div> -->
