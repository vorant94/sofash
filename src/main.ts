import { Bot, webhookCallback } from "grammy";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { contextStorage, getContext } from "hono/context-storage";
import type { Context } from "./shared/context/context.ts";
import { envSchema } from "./shared/context/env.ts";

if (import.meta.env.DEV) {
	// dotenv needed during development to set env locally from process.env
	// instead of vite's import.meta.env with all its restrictions (like VITE_ prefix)
	// so hono's env helper can get env from process.env like it does with node runtime
	const { config } = await import("dotenv");
	config();
}

const app = new Hono<Context>();

app.use(contextStorage());
app.use(async (hc, next) => {
	const parsedEnv = envSchema.parse(env(hc));
	const bot = new Bot(parsedEnv.BOT_TOKEN);

	hc.set("env", parsedEnv);
	hc.set("bot", bot);

	await next();
});

app.get("/", (hc) => hc.text("Hello CloudFlare!"));

// cannot set this path to be secret since in CF secrets are accessed only
// inside request. the same goes for creating a bot instance outside of request
// scope since token is a secret that is accessible only inside request
app.use("/telegram", (hc) => {
	const { bot } = getContext<Context>().var;

	bot.command("start", (tc) => tc.reply("Hello Telegram!"));
	bot.on("message", (tc) =>
		tc.reply(tc.message.text ?? "no text in your message"),
	);

	return webhookCallback(bot, "cloudflare-mod")(hc.req.raw);
});

export default app;
