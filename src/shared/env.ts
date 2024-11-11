import { z } from "zod";

export const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	BOT_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
