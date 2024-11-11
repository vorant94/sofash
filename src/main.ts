import { config } from "dotenv";
import { Bot, webhookCallback } from "grammy";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { type Env, envSchema } from "./shared/env.ts";

// dotenv mainly needed during development to set env locally from process.env
// instead of vite's import.meta.env with all its restrictions (like VITE_ prefix)
// so hono's env helper can get env from process.env like it does with node runtime
config();

const app = new Hono();

// set validated and parsed env back to the request context
app.use(async (c, next) => {
	c.env = envSchema.parse(env<Env>(c));
	await next();
});

app.get("/", (c) => c.text("Hello CloudFlare!"));

// cannot set this path to be secret since in CF secrets are accessed only
// during request. the same goes for creating a bot instance outside of request
// scope since token is a secret that is accessible only inside request
app.use("/telegram", (c) => {
	// TODO fix type casting
	const bot = new Bot((c.env as Env).BOT_TOKEN);

	bot.command("start", (c) => c.reply("Hello Telegram!"));
	bot.on("message", (c) =>
		c.reply(c.message.text ?? "no text in your message"),
	);

	return webhookCallback(bot, "hono")(c);
});

export default app;
