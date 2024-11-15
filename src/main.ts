import { Bot } from "grammy";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { contextStorage } from "hono/context-storage";
import { apiRoute } from "./api/api/api.route.ts";
import { healthRoute } from "./api/health/health.route.ts";
import { telegramRoute } from "./api/telegram/telegram.route.ts";
import type { Context } from "./shared/context/context.ts";
import { envSchema } from "./shared/context/env.ts";
import { dbConfig } from "./shared/schema/db-config.ts";

if (import.meta.env.DEV) {
	// dotenv needed during development to set env locally from process.env
	// instead of vite's import.meta.env with all its restrictions (like VITE_ prefix)
	// so hono's env helper can get env from process.env like it does with node runtime
	const { config } = await import("dotenv");
	config();
}

const app = new Hono<Context>();

app.use(contextStorage(), async (hc, next) => {
	const parsedEnv = envSchema.parse(env(hc));
	hc.set("env", parsedEnv);

	const bot = new Bot(parsedEnv.BOT_TOKEN);
	hc.set("bot", bot);

	if (import.meta.env.DEV) {
		const { drizzle } = await import("drizzle-orm/libsql");
		const db = drizzle(parsedEnv.DB_FILE_NAME, dbConfig);
		hc.set("db", db);
	} else {
		const { drizzle } = await import("drizzle-orm/d1");
		const db = drizzle(hc.env.DB, dbConfig);
		hc.set("db", db);
	}

	await next();
});

app.route("/api", apiRoute);
app.route("/health", healthRoute);
// cannot set this path to be secret since in CF secrets are accessed only
// inside request. the same goes for creating a bot instance outside of request
// scope since token is a secret that is accessible only inside request
app.route("/telegram", telegramRoute);

export default app;
