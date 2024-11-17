import { parseArgs } from "node:util";
import { config } from "dotenv";
import { Bot } from "grammy";
import { z } from "zod";
import { envSchema } from "../src/shared/context/env.ts";

export const { baseUrl } = z
	.object({
		baseUrl: z.string().url(),
	})
	.parse(
		parseArgs({
			options: {
				baseUrl: {
					type: "string",
				},
			},
		}).values,
	);

const env = envSchema
	.pick({
		// biome-ignore lint/style/useNamingConvention: env variables have different convention
		BOT_TOKEN: true,
	})
	.parse(config().parsed);

const bot = new Bot(env.BOT_TOKEN);

await bot.api.setWebhook(new URL("/telegram", baseUrl).toString());
