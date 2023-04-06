
export const production = !process.env.ROLLUP_WATCH;

export function onwarn(message) {
	// Make rollup shut up about circular dependency 'issues'.
	if (message.code === 'CIRCULAR_DEPENDENCY') return;
	console.warn(message.toString());
};