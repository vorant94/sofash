import type { Env as HonoEnv } from "hono";
import type { Env } from "./env.ts";

export interface Context extends HonoEnv {
	// biome-ignore lint/style/useNamingConvention: 3-rd party type
	Variables: { env: Env };
}
