import './scratch';
import './css';
import { BlockSubscriptInput } from "./src/block/BlockSubscriptInput";
import { BlockScriptRoot } from "./src/block/BlockScriptRoot";
import Target from './src/Target';
import App from './svelte/App.svelte';
import Blocks from './scratch/blocks';

export function load(callback: () => void) {
	callback();
}

export function main() {
	const target = new Target();

	const script = new BlockScriptRoot([
		Blocks.event.flag_clicked.createInstance(),

		Blocks.control.if.createInstance({

			idk: Blocks.operator.equals.createInstance({
				test: Blocks.operator.add.createInstance()
			}),
			testI: new BlockSubscriptInput([
				Blocks.motion.move_steps.createInstance(),

				Blocks.control.if.createInstance(),
				Blocks.control.forever.createInstance()
			])
		}),

		Blocks.motion.move_steps.createInstance({
			test: Blocks.operator.add.createInstance({
				test: Blocks.operator.add.createInstance({
					test: Blocks.operator.add.createInstance({
						test: Blocks.operator.add.createInstance({
							testII: Blocks.operator.equals.createInstance(),
						}),
					}),
				}),
				testII: Blocks.operator.add.createInstance(),
			}),
		}),
		Blocks.motion.move_steps.createInstance(),
		Blocks.motion.move_steps.createInstance(),
		Blocks.motion.move_steps.createInstance({
			test: Blocks.operator.add.createInstance({}),
		}),
		Blocks.motion.move_steps.createInstance(),
		Blocks.motion.move_steps.createInstance({
			test: Blocks.operator.add.createInstance({}),
		}),
	]);

	script.translation = { x: 100, y: 100 };
	target.blockScripts.scripts.push(script);
	target.blockScripts.transformScale = 1.5;
	target.blockScripts.transformPosition = { x: 0, y: 150 };

	new App({
		target: document.body,
		props: {
			scripts: target.blockScripts
		}
	});
};
