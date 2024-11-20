import { Composer } from "grammy";
import { renderToString } from "hono/jsx/dom/server";
import { z } from "zod";
import { checkHealth, healthStatuses } from "../../bl/system/check-health.ts";
import { userSchema } from "../../shared/schema/users.ts";
import { CodeBlock } from "../../shared/ui/code-block.tsx";
import { telegramCommand } from "./telegram.command.ts";

export const healthComposer = new Composer();

healthComposer.command(telegramCommand.health, async (tc) =>
	tc.reply(
		renderToString(
			<CodeBlock language="json">
				{JSON.stringify(healthDtoSchema.parse(await checkHealth()), null, 2)}
			</CodeBlock>,
		),
		// biome-ignore lint/style/useNamingConvention: 3-rd party type
		{ parse_mode: "HTML" },
	),
);

const healthDtoSchema = z.object({
	status: z.enum(healthStatuses),
	components: z.object({
		database: z.object({
			status: z.enum(healthStatuses),
		}),
		telegram: z.object({
			username: z.string(),
			webhookUrl: z.string().url().optional(),
		}),
	}),
	user: userSchema.pick({
		id: true,
		role: true,
		telegramChatId: true,
	}),
});
