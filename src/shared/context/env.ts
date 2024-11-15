import { z } from "zod";

export const envSchema = z.object({
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	BOT_TOKEN: z.string(),
	// biome-ignore lint/style/useNamingConvention: env variables have different convention
	DB_FILE_NAME: z.string().optional().default(":memory:"),
});

export type Env = z.infer<typeof envSchema>;
