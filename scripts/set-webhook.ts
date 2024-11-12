import { parseArgs } from "node:util";
import { config } from "dotenv";
import { Bot } from "grammy";
import { z } from "zod";
import { envSchema } from "../src/shared/context/env.ts";

const rawArgs = parseArgs({
	options: {
		baseUrl: {
			type: "string",
		},
	},
});

const argsSchema = z.object({ baseUrl: z.string().url() });

export const { baseUrl } = argsSchema.parse(rawArgs.values);

const env = envSchema.parse(config().parsed);

const bot = new Bot(env.BOT_TOKEN);

const fullUrl = new URL("/telegram", baseUrl);

await bot.api.setWebhook(fullUrl.toString());
