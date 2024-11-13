import { Composer } from "grammy";
import { getContext } from "hono/context-storage";
import { findOrCreateUserByTelegramChatId } from "../../bl/users/users.bl.ts";
import type { Context } from "../../shared/context/context.ts";

export const authComposer = new Composer();

authComposer.use(async (tc, next) => {
	const hc = getContext<Context>();

	if (!tc.chat) {
		throw new Error("Expect chat to be defined!");
	}

	const user = await findOrCreateUserByTelegramChatId(tc.chat.id);
	hc.set("user", user);

	await next();
});
