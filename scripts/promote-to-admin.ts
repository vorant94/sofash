import { inspect, parseArgs } from "node:util";
import { config } from "dotenv";
import { z } from "zod";
import { envSchema } from "../src/shared/context/env.ts";

const argsRaw = parseArgs({
	options: {
		id: {
			type: "string",
		},
	},
});

const argsSchema = z.object({ id: z.string().uuid() });

const { id } = argsSchema.parse(argsRaw.values);

const env = envSchema.parse(config().parsed);

const response = await fetch(
	`http://localhost:5173/admin/users/${id}/promote-to-admin`,
	{
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			// biome-ignore lint/style/useNamingConvention: env variables have different convention
			Authorization: `Basic ${Buffer.from(`${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`).toString("base64")}`,
		},
	},
);

const body = await response.json();

console.info(
	inspect(body, {
		depth: Number.POSITIVE_INFINITY,
		colors: true,
		maxArrayLength: Number.POSITIVE_INFINITY,
	}),
);
