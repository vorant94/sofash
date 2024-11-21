import type { ResultSet } from "@libsql/client";
import { sql } from "drizzle-orm";
import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";
import type { Constructor } from "../../shared/lib/constructor.ts";
import { catchError } from "../../shared/lib/error-or/catch-error.ts";
import { createLogger } from "../../shared/logger/logger.ts";
import type { User } from "../../shared/schema/users.ts";

export async function checkHealth(): Promise<Health> {
	// @ts-ignore
	// biome-ignore lint/correctness/noUnusedVariables: testing purposes
	using logger = createLogger("checkHealth");
	const { db, bot, user } = getContext<Context>().var;

	const [dbResolved, telegramMeResolved, telegramWebhookResolved] =
		await Promise.all([
			// cannot infer union generic from overloaded function
			// see https://github.com/microsoft/TypeScript/issues/44312
			catchError<ResultSet | D1Result<unknown>, Constructor<Error>>(
				db.run(sql`SELECT 1`).execute(),
			),
			catchError(bot.api.getMe()),
			catchError(bot.api.getWebhookInfo()),
		]);
	const [dbError] = dbResolved;
	const [telegramMeError, telegramMeResult] = telegramMeResolved;
	const [telegramWebhookError, telegramWebhookResult] = telegramWebhookResolved;

	return {
		status: "up",
		components: {
			database: {
				status: dbError ? "down" : "up",
			},
			telegram: {
				username: telegramMeError ? null : telegramMeResult.username,
				webhookUrl: telegramWebhookError ? null : telegramWebhookResult.url,
			},
		},
		user,
	};
}

export const healthStatuses = ["up", "down"] as const;
export type HealthStatus = (typeof healthStatuses)[number];

export interface Health {
	status: HealthStatus;
	components: {
		database: {
			status: HealthStatus;
		};
		telegram: {
			username?: string | null;
			webhookUrl?: string | null;
		};
	};
	user?: User;
}
