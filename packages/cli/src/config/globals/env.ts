import { z } from "zod";

const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	NODE_ENV: z.enum(["development", "production"]).default("development"),
});
export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
