import { Composer } from "grammy";
import { renderToString } from "hono/jsx/dom/server";
import { z } from "zod";
import { checkHealth, healthStatuses } from "../../bl/system/check-health.ts";
import { createLogger } from "../../shared/logger/logger.ts";
import { userSchema } from "../../shared/schema/users.ts";
import { CodeBlock } from "../../shared/ui/code-block.tsx";
import { telegramCommand } from "./telegram.command.ts";

export const healthComposer = new Composer();

healthComposer.command(telegramCommand.health, async (tc) => {
	// @ts-ignore
	// biome-ignore lint/correctness/noUnusedVariables: testing purposes
	using logger = createLogger("healthComposer");

	const html = renderToString(
		<CodeBlock language="json">
			{JSON.stringify(healthDtoSchema.parse(await checkHealth()), null, 2)}
		</CodeBlock>,
	);

	// biome-ignore lint/style/useNamingConvention: 3-rd party type
	return await tc.reply(html, { parse_mode: "HTML" });
});

const healthDtoSchema = z.object({
	status: z.enum(healthStatuses),
	components: z.object({
		database: z.object({
			status: z.enum(healthStatuses),
		}),
		telegram: z.object({
			username: z.string().nullish(),
			webhookUrl: z.string().url().nullish(),
		}),
	}),
	user: userSchema.pick({
		id: true,
		role: true,
		telegramChatId: true,
	}),
});
