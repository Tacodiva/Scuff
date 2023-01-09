import { BlockScript } from './src/block/BlockScript';
import { ScratchBlocks } from './src/scratch_blocks/ScratchBlocks';
import Target from './src/Target';
import App from './svelte/App.svelte';
import './css';

const target = new Target();

const script = new BlockScript([
	ScratchBlocks.MOVE_STEPS.createInstance({
		test: ScratchBlocks.OP_PLUS.createInstance({
			test: ScratchBlocks.OP_PLUS.createInstance({
				test: ScratchBlocks.OP_PLUS.createInstance({
					test: ScratchBlocks.OP_PLUS.createInstance({
						testII: ScratchBlocks.OP_PLUS.createInstance(),
					}),
				}),
			}),
			testII: ScratchBlocks.OP_PLUS.createInstance(),
		}),
	}),
	ScratchBlocks.MOVE_STEPS.createInstance(),
	ScratchBlocks.MOVE_STEPS.createInstance({
		test: ScratchBlocks.OP_PLUS.createInstance({}),
	}),
	ScratchBlocks.MOVE_STEPS.createInstance(),
	ScratchBlocks.MOVE_STEPS.createInstance({
		test: ScratchBlocks.OP_PLUS.createInstance({}),
	}),
	ScratchBlocks.MOVE_STEPS.createInstance(),
	ScratchBlocks.MOVE_STEPS.createInstance({
		test: ScratchBlocks.OP_PLUS.createInstance({}),
	}),
]);

script.translation = { x: 100, y: 100 };
target.blockScripts.scripts.push(script);
target.blockScripts.transformScale = 1.5;
target.blockScripts.transformPosition = { x: 0, y: 150 };

const app = new App({
	target: document.body,
	props: {
		scripts: target.blockScripts
	}
});

export default app;
