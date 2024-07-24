import process from "node:process";
import { z } from "zod";
import { logLevelSchema } from "../../logging/types/log-level.js";

const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	CI: z.coerce.boolean().default(false),
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	LOG_LEVEL: logLevelSchema,
});
export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
