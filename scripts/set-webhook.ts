import process from "node:process";
import { parseArgs } from "node:util";
import { config } from "dotenv";
import { Bot } from "grammy";
import { z } from "zod";
import { envSchema } from "../src/shared/env.ts";

config();

const rawArgs = parseArgs({
	options: {
		baseUrl: {
			type: "string",
		},
	},
});

const argsSchema = z.object({ baseUrl: z.string().url() });

export const { baseUrl } = argsSchema.parse(rawArgs.values);

const env = envSchema.parse(process.env);

const bot = new Bot(env.BOT_TOKEN);

const fullUrl = new URL("/telegram", baseUrl);

await bot.api.setWebhook(fullUrl.toString());
