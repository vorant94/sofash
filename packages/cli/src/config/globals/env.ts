import { z } from "zod";
import { logLevelSchema } from "../../logging/types/log-level.js";

const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	LOG_LEVEL: logLevelSchema,
});
export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
