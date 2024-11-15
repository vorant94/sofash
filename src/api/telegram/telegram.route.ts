import { webhookCallback } from "grammy";
import { Hono } from "hono";
import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";
import { authComposer } from "./auth.composer.ts";
import { echoComposer } from "./echo.composer.ts";

export const telegramRoute = new Hono();

telegramRoute.use("/", (hc) => {
	const { bot } = getContext<Context>().var;

	bot.use(authComposer);

	bot.use(echoComposer);

	return webhookCallback(bot, "cloudflare-mod")(hc.req.raw);
});
