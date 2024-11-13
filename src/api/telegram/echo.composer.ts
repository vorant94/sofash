import { Composer } from "grammy";
import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";

export const echoComposer = new Composer();

echoComposer.on("message", (tc) => {
	const { user } = getContext<Context>().var;

	return tc.reply(
		`you are ${user.id} and you wrote ${tc.message.text ? `"${tc.message.text}"` : "nothing"}`,
	);
});
