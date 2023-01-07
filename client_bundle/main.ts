import Blocks from './src/block/Blocks';
import { BlockScript } from './src/block/BlockScript';
import Target from './src/Target';
import App from './svelte/App.svelte';

const target = new Target();

const script = new BlockScript([
	Blocks.MOVE_STEPS.createInstance({
		test: Blocks.OP_PLUS.createInstance({
			test: Blocks.OP_PLUS.createInstance({
				test: Blocks.OP_PLUS.createInstance({
					test: Blocks.OP_PLUS.createInstance({
						test: Blocks.OP_PLUS.createInstance({}),
						testII: Blocks.OP_PLUS.createInstance(),
					}),
				}),
			}),
			testII: Blocks.OP_PLUS.createInstance(),
		}),
	}),
	Blocks.MOVE_STEPS.createInstance(),
	Blocks.MOVE_STEPS.createInstance({
		test: Blocks.OP_PLUS.createInstance({}),
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
