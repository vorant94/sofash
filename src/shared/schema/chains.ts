import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { resourceType } from "./resource-types.ts";
import { users } from "./users.ts";

export const chains = sqliteTable("chains", {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	resourceType: text({ enum: [resourceType.chain] })
		.notNull()
		.default(resourceType.chain),
	createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: text()
		.notNull()
		.references(() => users.id),
	updatedAt: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),

	name: text().notNull(),
});

export const chainSchema = createSelectSchema(chains);

export type Chain = z.infer<typeof chainSchema>;
