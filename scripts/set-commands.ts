import { config } from "dotenv";
import { Bot } from "grammy";
import { envSchema } from "../src/shared/context/env.ts";

const env = envSchema
	.pick({
		// biome-ignore lint/style/useNamingConvention: env variables have different convention
		BOT_TOKEN: true,
	})
	.parse(config().parsed);

const bot = new Bot(env.BOT_TOKEN);

await bot.api.setMyCommands([
	// { command: telegramCommand.health, description: "Health Check" },
]);
