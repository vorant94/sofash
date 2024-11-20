import { Hono } from "hono";
import { z } from "zod";
import { checkHealth, healthStatuses } from "../../bl/system/check-health.ts";

export const healthRoute = new Hono();

healthRoute.get("/", async (hc) =>
	hc.json(healthDtoSchema.parse(await checkHealth())),
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
});
