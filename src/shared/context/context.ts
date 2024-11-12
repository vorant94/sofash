import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { Bot } from "grammy";
import type { Env as HonoEnv } from "hono";
import type { Env } from "./env.ts";

export interface Context extends HonoEnv {
	// biome-ignore lint/style/useNamingConvention: 3-rd party type
	Variables: {
		env: Env;
		bot: Bot;
		db: DrizzleD1Database | LibSQLDatabase;
	};
	// biome-ignore lint/style/useNamingConvention: 3-rd party type
	Bindings: {
		// biome-ignore lint/style/useNamingConvention: env variables have different convention
		DB: D1Database;
	};
}
