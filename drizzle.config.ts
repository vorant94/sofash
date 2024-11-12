import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { envSchema } from "./src/shared/context/env.ts";

const env = envSchema.parse(config().parsed);

export default defineConfig({
	out: "./drizzle",
	schema: "./src/shared/schema",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DB_FILE_NAME,
	},
});
