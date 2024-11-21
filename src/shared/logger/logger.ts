import { getContext } from "hono/context-storage";
import type { Context } from "../context/context.ts";

export function createLogger(name: string): Logger {
	names.push(name);

	logger.debug("start");

	return logger;
}

export interface Logger extends Disposable {
	debug(...args: Array<unknown>): void;
}

const logger: Logger = {
	debug(...args: Array<unknown>): void {
		const name = names.at(-1);
		const { requestId } = getContext<Context>().var;

		console.debug(requestId, name, ...args);
	},
	[Symbol.dispose]() {
		logger.debug("end");
		names.pop();
	},
};

const names: Array<string> = [];
