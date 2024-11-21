import { Hono } from "hono";
import { z } from "zod";
import { checkHealth, healthStatuses } from "../../bl/system/check-health.ts";
import { createLogger } from "../../shared/logger/logger.ts";

export const healthRoute = new Hono();

healthRoute.get("/", async (hc) => {
	// @ts-ignore
	// biome-ignore lint/correctness/noUnusedVariables: testing purposes
	using logger = createLogger("healthRoute");

	const json = healthDtoSchema.parse(await checkHealth());

	return hc.json(json);
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
});
